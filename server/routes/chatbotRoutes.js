import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages, language } = req.body;
    
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

    const langInstruction = language === 'ru' 
      ? "IMPORTANT: The user prefers Russian. Please answer all their questions in Russian, unless they speak in another language." 
      : language === 'en' 
      ? "IMPORTANT: The user prefers English. Please answer all their questions in English, unless they speak in another language." 
      : "IMPORTANT: The user prefers Uzbek. Please answer all their questions in Uzbek, unless they speak in another language.";

    const systemInstruction = `Siz "E-Hunarmand" milliy hunarmandchilik mahsulotlari internet do'konining tajribali savdo yordamchisi (Sales Assistant) va maslahatchisisiz.
Maqsadingiz: Mijozga iloji boricha ko'proq yordam berish va bizdagi mahsulotlarni sotib olishga jalb qilish (sotish darajasini maksimal darajaga ko'tarish). 
Mijozga birinchi bo'lib qiziqarli savollar bering, ehtiyojlarini, qanday sovg'a yoki buyum qidirayotganini so'rab oling.
Javobingizni doimo mijoz tilida va samimiy, emoji'lar bilan yozing.
${langInstruction}
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

    // List of models to try in order (Fallback Strategy)
    // Newest models first, then fallbacks
    const modelsToTry = [
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];

    let responseText = null;
    let allErrors = [];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Chatbot] Trying model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: geminiMessages,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });
        
        if (response && response.text) {
          responseText = response.text;
          console.log(`[Chatbot] Muaffaqiyatli: ${modelName} orqali javob olindi.`);
          break; // Stop trying if successful
        }
      } catch (err) {
        const errMsg = err.message || String(err);
        console.error(`[Chatbot] Xatolik: ${modelName}: ${errMsg}`);
        allErrors.push(`${modelName}: ${errMsg}`);
        
        // If it's not a quota/rate limit error, stop trying (e.g., auth error)
        if (err.status === 401 || err.status === 403) {
          console.error('[Chatbot] Auth xatoligi - API kalitda muammo bor.');
          break;
        }
      }
    }

    if (responseText) {
      res.json({ text: responseText });
    } else {
      console.error('[Chatbot] Barcha modellar xato berdi!');
      
      // Return clean fallback message (no debug info shown to user)
      let fallbackText = "Salom! Men sizga do'konimiz va milliy mahsulotlarimiz bo'yicha yordam berishga tayyorman. Hozirda AI xizmatida texnik nosozlik mavjud, ammo siz istalgan mahsulotimizni [Mahsulotlar](/products) sahifasidan topib buyurtma qilishingiz mumkin! 🛍️";
      if (language === 'ru') {
        fallbackText = "Здравствуйте! Я готов помочь вам с выбором наших национальных изделий. В данный момент сервис ИИ временно недоступен, но вы можете просмотреть и заказать любые товары на странице [Продукты](/products)! 🛍️";
      } else if (language === 'en') {
        fallbackText = "Hello! I'm ready to help you with our traditional craft products. Right now the AI service is temporarily unavailable, but you can browse and order all items on the [Products](/products) page! 🛍️";
      }
      
      res.json({ text: fallbackText });
    }

  } catch (error) {
    console.error('Chatbot umumiy xatosi:', error);
    res.status(500).json({ message: 'Chatbotda xatolik yuz berdi.', error: error.message });
  }
});

export default router;
