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

    const modelName = 'gemini-2.5-flash';

    console.log(`[Visual Search] Analyzing image with ${modelName}...`);
    
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
        temperature: 0.1, // Low temp for more precise/consistent output
      }
    });

    if (response && response.text) {
      const rawText = response.text.trim();
      let matchedIds = [];
      
      // Clean markdown formatting if Gemini included it
      const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        matchedIds = JSON.parse(jsonStr);
      } catch (e) {
        console.error("[Visual Search] JSON parse error:", rawText);
        return res.status(500).json({ message: "AI javobini o'qishda xatolik yuz berdi." });
      }

      if (!Array.isArray(matchedIds) || matchedIds.length === 0) {
        return res.json([]); // No matches
      }

      // Fetch the actual product objects
      const matchedProducts = await Product.find({ _id: { $in: matchedIds } })
        .populate('craftsman', 'name region shopName')
        .limit(3);
        
      res.json(matchedProducts);
    } else {
      res.status(500).json({ message: 'Vizual qidiruvda xatolik yuz berdi.' });
    }

  } catch (error) {
    console.error('[Visual Search] Umumiy xatosi:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
});

export default router;
