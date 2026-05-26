import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
  const timestamps = rateLimitMap.get(ip);
  const recentTimestamps = timestamps.filter(time => now - time < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return res.status(429).json({ message: "Siz juda ko'p qidiruv qildingiz. Iltimos 1 daqiqa kuting." });
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  next();
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper: try to get AI response from Groq or Gemini
async function callAI({ systemPrompt, userMessage, imageBase64, imageMimeType }) {
  let responseText = null;

  // =============================================
  // 1) TRY GROQ (Free, fast, no billing)
  // Note: Groq doesn't support image inputs yet, skip for visual search
  // =============================================
  if (process.env.GROQ_API_KEY && !imageBase64) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const groqModels = [
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ];

    for (const modelName of groqModels) {
      try {
        console.log(`[AI] Groq sinab ko'rilmoqda: ${modelName}...`);
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.1,
          max_tokens: 512,
        });
        const text = completion.choices?.[0]?.message?.content;
        if (text) {
          responseText = text;
          console.log(`[AI] Groq muvaffaqiyatli: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`[AI] Groq xatolik ${modelName}:`, err.message);
      }
    }
  }

  // =============================================
  // 2) FALLBACK TO GEMINI (supports images)
  // =============================================
  if (!responseText && process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const geminiModels = [
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];

    for (const modelName of geminiModels) {
      try {
        console.log(`[AI] Gemini sinab ko'rilmoqda: ${modelName}...`);

        const parts = [];
        if (userMessage) parts.push({ text: userMessage });
        if (imageBase64 && imageMimeType) {
          parts.push({ inlineData: { data: imageBase64, mimeType: imageMimeType } });
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts }],
          config: { systemInstruction: systemPrompt, temperature: 0.1 }
        });

        if (response && response.text) {
          responseText = response.text;
          console.log(`[AI] Gemini muvaffaqiyatli: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`[AI] Gemini xatolik ${modelName}:`, err.message);
        if (err.status === 401 || err.status === 403) break;
      }
    }
  }

  return responseText;
}

// @route   POST /api/search/visual
router.post('/visual', rateLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Iltimos, rasm yuklang." });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const products = await Product.find({}).select('_id title category price image');

    const productListText = products.map(p =>
      `- ID: ${p._id}, Nomi: "${p.title}", Kategoriya: ${p.category}`
    ).join('\n');

    const systemPrompt = `Siz vizual qidiruv AI'sisiz.
Sizga bitta rasm va mahsulotlar ro'yxati beriladi.
Rasmdagi ob'yektga eng o'xshash 3 ta mahsulotni topib, faqat ularning ID larini JSON array formatida qaytaring.
Boshqa hech qanday matn qo'shmang. Agar topilmasa, bo'sh array [] qaytaring.

Mahsulotlar:
${productListText}

Javob formati: ["id1", "id2", "id3"]`;

    const userMessage = "Ushbu rasmga eng o'xshash mahsulotlarni topib, faqat ID larini JSON array shaklida qaytar.";

    const responseText = await callAI({
      systemPrompt,
      userMessage,
      imageBase64: base64Image,
      imageMimeType: mimeType
    });

    if (!responseText) {
      console.warn('[Visual Search] Barcha AI xizmatlari xato berdi. Fallback ishlatilmoqda.');
      const fallback = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      return res.json(fallback);
    }

    // Parse response
    let matchedIds = [];
    const jsonStr = responseText.trim().replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      matchedIds = JSON.parse(jsonStr);
    } catch (e) {
      const matches = responseText.match(/[0-9a-fA-F]{24}/g);
      if (matches) matchedIds = [...new Set(matches)];
    }

    if (!Array.isArray(matchedIds)) matchedIds = [];
    const validIds = matchedIds.filter(id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));

    if (validIds.length === 0) {
      const fallback = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      return res.json(fallback);
    }

    const matched = await Product.find({ _id: { $in: validIds } })
      .populate('craftsman', 'name region shopName')
      .limit(3);

    res.json(matched);

  } catch (error) {
    console.error('[Visual Search] Xatosi:', error);
    try {
      const fallback = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      res.json(fallback);
    } catch (dbErr) {
      res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
    }
  }
});

export default router;
