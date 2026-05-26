import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages, language } = req.body;

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
Maqsadingiz: Mijozga iloji boricha ko'proq yordam berish va bizdagi mahsulotlarni sotib olishga jalb qilish.
Mijozga birinchi bo'lib qiziqarli savollar bering, ehtiyojlarini, qanday sovg'a yoki buyum qidirayotganini so'rab oling.
Javobingizni doimo mijoz tilida va samimiy, emoji'lar bilan yozing.
${langInstruction}
QAT'IY QOIDA (RASMLAR UCHUN): Mahsulot tavsiya qilayotganda DOIM uning rasmini va havolasini Markdown orqali bering. Masalan:
![Mahsulot Nomi](rasm_url_manzili)
[Batafsil ma'lumot va sotib olish](/products/id) - Narxi so'm
Mijoz mahsulotga qiziqsa yoki "olmoqchiman", "qanday olsam bo'ladi" desa, darhol shu rasmni va havolani jo'nating.
Shuningdek, cross-sell - qo'shimcha mos mahsulotlarni ham taklif qiling.
Faqat quyida ro'yxatda bor mahsulotlarni soting.
Sotuvni oshiruvchi psixologik iboralardan foydalaning.

Hozirgi vaqtda do'konimizda quyidagi mahsulotlar bor:
${productListText}
`;

    // Prepare messages
    const chatMessages = messages.map(m => ({
      role: m.role === 'ai' || m.role === 'model' ? 'assistant' : 'user',
      content: m.text
    }));

    let responseText = null;

    // =============================================
    // 1) TRY GROQ FIRST (Free, fast, no billing)
    // =============================================
    if (process.env.GROQ_API_KEY) {
      const groqModels = [
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
      ];

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      for (const modelName of groqModels) {
        try {
          console.log(`[Chatbot] Groq model sinab ko'rilmoqda: ${modelName}...`);
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: 'system', content: systemInstruction },
              ...chatMessages
            ],
            temperature: 0.7,
            max_tokens: 1024,
          });

          const text = completion.choices?.[0]?.message?.content;
          if (text) {
            responseText = text;
            console.log(`[Chatbot] Groq muvaffaqiyatli: ${modelName}`);
            break;
          }
        } catch (err) {
          console.warn(`[Chatbot] Groq xatolik ${modelName}:`, err.message);
        }
      }
    }

    // =============================================
    // 2) FALLBACK TO GEMINI
    // =============================================
    if (!responseText && process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const geminiMessages = messages.map(m => ({
        role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

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
          console.log(`[Chatbot] Gemini model sinab ko'rilmoqda: ${modelName}...`);
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
            console.log(`[Chatbot] Gemini muvaffaqiyatli: ${modelName}`);
            break;
          }
        } catch (err) {
          console.warn(`[Chatbot] Gemini xatolik ${modelName}:`, err.message);
          if (err.status === 401 || err.status === 403) break;
        }
      }
    }

    // =============================================
    // 3) SEND RESPONSE
    // =============================================
    if (responseText) {
      res.json({ text: responseText });
    } else {
      // Clean fallback - no debug info shown to user
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
