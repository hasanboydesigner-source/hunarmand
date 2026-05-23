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
      `- ID: ${p._id}, Nomi: "${p.title}", Narxi: ${p.price} so'm, Kategoriya: ${p.category}, Hunarmand: ${p.craftsman?.shopName || p.craftsman?.name || 'Noma\'lum'}, Rasm URL: ${p.image}. Ta'rif: ${p.description.substring(0, 100)}...`
    ).join('\n');

    const systemInstruction = `Siz "E-Hunarmand" milliy hunarmandchilik mahsulotlari internet do'konining tajribali savdo yordamchisi (Sales Assistant) va maslahatchisisiz.
Maqsadingiz: Mijozga iloji boricha ko'proq yordam berish va bizdagi mahsulotlarni sotib olishga jalb qilish (sotish darajasini maksimal darajaga ko'tarish). 
Mijozga birinchi bo'lib qiziqarli savollar bering, ehtiyojlarini, qanday sovg'a yoki buyum qidirayotganini so'rab oling.
Javobingizni doimo mijoz tilida (asosan O'zbek tilida) va samimiy, emoji'lar bilan yozing.
QAT'IY QOIDA (RASMLAR UCHUN): Mahsulot tavsiya qilayotganda DOIM uning rasmini va havolasini Markdown orqali bering. Masalan: 
![Mahsulot Nomi](rasm_url_manzili)
[Batafsil ma'lumot va sotib olish](/products/id) - Narxi so'm
Mijoz mahsulotga qiziqsa yoki "olmoqchiman", "qanday olsam bo'ladi" desa, darhol shu rasmni va havolani jo'nating va "Shu ssilkaga kirib hoziroq buyurtma berishingiz mumkin!" deb undang. 
Shuningdek, mijoz bitta narsa tanlasa, uning yoniga qo'shimcha sotib olishi mumkin bo'lgan (cross-sell) boshqa mos mahsulotlarni ham xuddi shunday rasm bilan taklif qiling.
E'tibor bering: Faqat quyida ro'yxatda bor mahsulotlarni soting. Agar mijoz boshqa narsa so'rasa, bizda faqat quyidagi mahsulotlar borligini chiroyli tushuntiring.
Sotuvni oshiruvchi psixologik iboralardan ("Juda ajoyib tanlov", "Eksklyuziv sovg'a", "Yaqinlaringiz uchun ideal") foydalaning.

Hozirgi vaqtda do'konimizda quyidagi mahsulotlar bor:
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
