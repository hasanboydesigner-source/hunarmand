import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Simple in-memory rate limiter to prevent API abuse
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // 5 requests per minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip);
  // Remove requests older than 1 minute
  const recentTimestamps = timestamps.filter(time => now - time < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return res.status(429).json({ message: "Siz juda ko'p qidiruv qildingiz. Iltimos 1 daqiqa kuting." });
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  next();
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Models to try in order (fallback strategy)
const modelsToTry = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

// @route   POST /api/search/visual
// @desc    Perform visual search using Gemini Vision
router.post('/visual', rateLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Iltimos, rasm yuklang." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API kaliti topilmadi." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Fetch all products to give context to the LLM
    const products = await Product.find({}).select('_id title category price image');

    const productListText = products.map(p => 
      `- ID: ${p._id}, Nomi: "${p.title}", Kategoriya: ${p.category}, Rasm URL: ${p.image}`
    ).join('\n');

    const systemInstruction = `Siz vizual qidiruv (Visual Search) AI'sisiz.
Sizga bitta rasm (foydalanuvchi qidirayotgan ob'yekt) va bizning bazamizdagi mahsulotlar ro'yxati beriladi.
Maqsadingiz: Yuklangan rasmdagi ob'yektning rangi, shakli, naqshi va turini analiz qilib, quyidagi mahsulotlar ro'yxatidan eng ko'p o'xshash bo'lgan 3 ta (yoki undan kamroq) mahsulotni topish.
Faqatgina topilgan mahsulotlarning ID raqamlarini toza JSON array formatida qaytaring, boshqa hech qanday izoh yoki matn qo'shmang. Agar umuman o'xshash narsa topilmasa, bo'sh array [] qaytaring.

Mahsulotlar bazasi:
${productListText}

Javobingiz faqat quyidagi formatda bo'lishi shart:
["id1", "id2", "id3"]`;

    let responseText = null;
    let allErrors = [];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Visual Search] Trying model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                { text: "Ushbu rasmga eng o'xshash mahsulotlarni topib, faqat ularning ID larini JSON array shaklida qaytar." },
                { 
                  inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                  }
                }
              ]
            }
          ],
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.1,
          }
        });
        
        if (response && response.text) {
          responseText = response.text;
          console.log(`[Visual Search] Muaffaqiyatli: ${modelName} orqali natija olindi.`);
          break;
        }
      } catch (err) {
        const errMsg = err.message || String(err);
        console.warn(`[Visual Search] Xatolik: ${modelName}: ${errMsg}`);
        allErrors.push(`${modelName}: ${errMsg}`);
        
        // If auth error, no point trying more models
        if (err.status === 401 || err.status === 403) {
          break;
        }
      }
    }

    if (!responseText) {
      console.warn('[Visual Search] Barcha modellar xato berdi. Fallback ishlatilmoqda.', allErrors.join(' | '));
      const fallbackProducts = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      return res.json(fallbackProducts);
    }

    // Parse the response
    let matchedIds = [];
    const rawText = responseText.trim();
    // Clean markdown formatting if Gemini included it
    const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      matchedIds = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("[Visual Search] JSON parse error, trying regex extraction:", rawText);
      // Try extracting any 24-character hex strings
      const matches = rawText.match(/[0-9a-fA-F]{24}/g);
      if (matches) {
        matchedIds = [...new Set(matches)];
      }
    }

    if (!Array.isArray(matchedIds)) {
      matchedIds = [];
    }

    // Filter valid object IDs
    const validMatchedIds = matchedIds.filter(id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));

    if (validMatchedIds.length === 0) {
      console.warn('[Visual Search] Mos mahsulot topilmadi. Fallback ishlatilmoqda.');
      const fallbackProducts = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      return res.json(fallbackProducts);
    }

    // Fetch the actual product objects
    const matchedProducts = await Product.find({ _id: { $in: validMatchedIds } })
      .populate('craftsman', 'name region shopName')
      .limit(3);
      
    res.json(matchedProducts);

  } catch (error) {
    console.error('[Visual Search] Umumiy xatosi:', error);
    try {
      const fallbackProducts = await Product.find({}).populate('craftsman', 'name region shopName').limit(3);
      res.json(fallbackProducts);
    } catch (dbErr) {
      console.error('[Visual Search] Database xatoligi:', dbErr);
      res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
    }
  }
});

export default router;
