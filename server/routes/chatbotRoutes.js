import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Make sure API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API kaliti topilmadi." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch all products to give context to the LLM
    const products = await Product.find({}).populate('craftsman', 'name shopName');
    
    const productListText = products.map(p => 
      `- ID: ${p._id}, Nomi: "${p.title}", Narxi: ${p.price} so'm, Kategoriya: ${p.category}, Hunarmand: ${p.craftsman?.shopName || p.craftsman?.name || 'Noma\'lum'}, Zaxirada: ${p.inStock} ta. Ta'rif: ${p.description.substring(0, 100)}...`
    ).join('\n');

    const systemInstruction = `Siz "E-Hunarmand" milliy hunarmandchilik mahsulotlari internet do'konining maxsus savdo bo'yicha yordamchisi (Sales Assistant) hisoblanasiz.
Maqsadingiz: Mijozga iloji boricha ko'proq yordam berish va bizdagi mahsulotlarni sotib olishga qiziqtirish (sotish darajasini maksimal darajaga ko'tarish). 
Mijoz bilan xuddi tajribali sotuvchi kabi muomala qiling: ehtiyojlarini, qanday sovg'a yoki buyum qidirayotganini so'rab oling, didini biling va unga mos keladigan mahsulotlarni bizning ro'yxatdan tavsiya qiling.
Javobingizni doimo mijoz tilida (asosan O'zbek tilida) va samimiy, emoji'lar bilan yozing.
Mahsulot tavsiya qilayotganda ularga Markdown formati orqali to'g'ridan-to'g'ri havola bering: masalan "[Mahsulot Nomi](/products/id)". (Bu juda muhim, chunki mijoz ustiga bosib sotib olishi kerak).
E'tibor bering: Faqat quyida ro'yxatda bor mahsulotlarni soting va taklif qiling. Agar mijoz boshqa narsa so'rasa, bizda faqat quyidagi mahsulotlar borligini chiroyli tushuntirib, mavjudlarini tavsiya qiling.

Hozirgi vaqtda do'konimizda quyidagi mahsulotlar bor (ularning ro'yxati va ID lari):
${productListText}
`;

    // Map frontend messages to Gemini format
    const geminiMessages = messages.map(m => ({
      role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: geminiMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Chatbot xatosi:', error);
    res.status(500).json({ message: 'Chatbotda xatolik yuz berdi.' });
  }
});

export default router;
