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
      ? `ВАЖНО — ЯЗЫК И ГРАММАТИКА:
- Отвечай ТОЛЬКО на русском языке, если пользователь сам не пишет на другом языке.
- Пиши грамотно, без грамматических ошибок. Каждое предложение должно быть осмысленным и понятным.
- Не используй неполные предложения. Не обрывай мысли на середине.`
      : language === 'en'
      ? `IMPORTANT — LANGUAGE AND GRAMMAR:
- Always respond in English unless the user writes in another language.
- Write grammatically correct, complete sentences. Every sentence must be meaningful and clear.
- Never use broken or incomplete sentences.`
      : `MUHIM — TIL VA GRAMMATIKA QOIDALARI:
- Faqat O'ZBEK tilida javob ber (agar foydalanuvchi o'zi boshqa tilda yozmasa).
- To'g'ri, aniq va tushunarli o'zbek tilida yoz. Har bir gap mantiqli va to'liq bo'lishi SHART.
- Grammatik xatolarga YO'L QO'YMA: fe'llar, otlar, sifatlar to'g'ri shaklda ishlatilsin.
- Noto'g'ri, tushunarsiz yoki yarim qolgan gaplar yozma.
- "sizga", "qilishingiz", "mahsulot" kabi so'zlarni to'g'ri yoz.`;

    const systemInstruction = `Sen "E-Hunarmand" milliy hunarmandchilik mahsulotlari internet do'konining aqlli va samimiy savdo maslahatchisisisan.

${langInstruction}

ASOSIY XATTI-HARAKAT QOIDALARI:
1. HECH QACHON dastlab mahsulotlar ro'yxatini to'kib tashlamagin! Avval mijoz bilan samimiy suhbatlash.
2. Mijoz biror narsa so'raganda (masalan "sovg'a qidiryapman"), DARHOL 2–3 ta aniqlashtiruvchi savol ber:
   - Kim uchun? (ota, ona, do'st, sevgilisi, bola...)
   - Qanday munosabat? (tug'ilgan kun, nikoh, bayram...)
   - Taxminiy byudjet qancha?
3. Faqat mijoz javob bergandan KEYIN, unga mos 1–2 ta mahsulot taklif qil.
4. Tavsiya qilayotganda mahsulot rasmini va havolasini DOIM Markdown orqali ber:
   ![Mahsulot Nomi](rasm_url)
   [Ko'rish va buyurtma berish](/products/ID) — Narxi: X so'm
5. Har bir tavsiyadan keyin cross-sell qil — "Buni bilan yaxshi ketadigan..."
6. Samimiy, issiq, emojili tilda yoz. Mijozni "Siz" deb murojaat qil.
7. Psixologik iboralar ishlatish mumkin: "Eksklyuziv sovg'a", "Qo'lda ishlangan", "Yagona nusxa", "Mahalliy usta tomonidan".
8. Faqat quyida ko'rsatilgan mavjud mahsulotlarni taklif qil. Mavjud bo'lmagan mahsulotlarni to'qima.

Do'konimizda mavjud mahsulotlar:
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
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
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
            temperature: 0.4,
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
              temperature: 0.4,
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
