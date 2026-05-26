import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Helper to generate professional local business advice (no AI needed)
const generateLocalAdvice = (craftsman, products) => {
  let totalViews = 0;
  let totalSold = 0;
  let lowStockProducts = [];
  let highViewLowSaleProducts = [];
  let bestSeller = null;
  let maxSold = -1;

  products.forEach(p => {
    totalViews += p.views || 0;
    totalSold += p.sold || 0;
    if (p.inStock <= 5) lowStockProducts.push(p.title);
    if ((p.views || 0) > 20 && (p.sold || 0) === 0) highViewLowSaleProducts.push(p.title);
    if ((p.sold || 0) > maxSold) { maxSold = p.sold || 0; bestSeller = p.title; }
  });

  return `### 📊 Shaxsiy AI Biznes Tahlil Hisoboti

Salom, **${craftsman.name}**! Sizning do'koningiz va mahsulotlaringiz statistikasi asosida tayyorlangan tahlil:

---

#### 📈 Savdo va Faollik Ko'rsatkichlari
* **Jami mahsulotlaringiz:** ${products.length} turdagi mahsulot
* **Umumiy ko'rishlar soni:** ${totalViews} marta
* **Umumiy sotilgan mahsulotlar:** ${totalSold} ta mahsulot
* **O'rtacha konversiya:** ${totalViews > 0 ? ((totalSold / totalViews) * 100).toFixed(1) : 0}%

---

#### 🌟 Amaliy Tavsiyalar:

${bestSeller && maxSold > 0 ? `1. **🔥 Top Mahsulot (Best Seller):**
   - **"${bestSeller}"** mahsuloti ${maxSold} marta sotilib, eng ommabop mahsulotingizga aylandi!
   - *Tavsiya:* Sifatini saqlab qoling va zaxirasi doim yetarli bo'lishini ta'minlang.` : ''}

${lowStockProducts.length > 0 ? `2. **⚠️ Zaxirani Yangilash Zarur:**
   - Kam qolgan mahsulotlar: *${lowStockProducts.join(', ')}*
   - *Tavsiya:* Zaxirani kamida 10-15 taga yetkazib qo'ying.` : ''}

${highViewLowSaleProducts.length > 0 ? `3. **🔍 Ko'rishlar Bor, Lekin Sotuv Yo'q:**
   - *${highViewLowSaleProducts.join(', ')}*
   - *Tavsiya:* Narxni 5-10% tushirib ko'ring yoki rasmlarni yangilang.` : ''}

4. **💬 Xaridorlar bilan Aloqa:**
   - Sharhlarga samimiy javob qaytarishni unutmang.

5. **🚀 Biznes Strategiyasi:**
   - Yangi mahsulotlar qo'shganda batafsil tavsif yozing.
   - Ijtimoiy tarmoqlarda mahsulotlar tayyorlanish jarayonini ko'rsating.

*Biznesingiz rivojida muvaffaqiyatlar! 💼✨*`;
};

// @route   GET /api/advisor/:craftsmanId
router.get('/:craftsmanId', async (req, res) => {
  try {
    const craftsmanId = req.params.craftsmanId;

    if (!craftsmanId || !/^[0-9a-fA-F]{24}$/.test(craftsmanId)) {
      return res.status(400).json({ message: "Noto'g'ri hunarmand ID raqami." });
    }

    const craftsman = await User.findById(craftsmanId);
    if (!craftsman || craftsman.role !== 'craftsman') {
      return res.status(404).json({ message: "Hunarmand topilmadi." });
    }

    const products = await Product.find({ craftsman: craftsmanId });

    if (products.length === 0) {
      return res.json({ advice: "Sizda hali mahsulotlar yo'q. Dastlab mahsulot qo'shing va savdoni boshlang!" });
    }

    // Prepare data for AI
    let dataForAI = `Hunarmand ismi: ${craftsman.name}\n\nMahsulotlar statistikasi:\n`;
    products.forEach((p, index) => {
      dataForAI += `\n${index + 1}. ${p.title}
- Narxi: ${p.price} so'm
- Zaxirada: ${p.inStock} ta
- Sotildi: ${p.sold} ta
- Ko'rishlar: ${p.views} marta
`;
      if (p.reviews && p.reviews.length > 0) {
        dataForAI += `- Sharhlar:\n`;
        p.reviews.forEach(r => {
          dataForAI += `  * Reyting: ${r.rating}/5, Izoh: "${r.text}"\n`;
        });
      }
    });

    const systemInstruction = `Siz elektron tijorat platformasidagi "Senior AI Biznes Maslahatchi"sisiz.
Hunarmandning mahsulotlari statistikasini (ko'rilishlar, sotilishlar, zaxira, sharhlar) chuqur tahlil qilib, savdoni oshirish bo'yicha amaliy maslahatlar bering.
Masalan:
- Agar views yuqori lekin sold kam bo'lsa - narx yoki rasm maslahat bering
- Agar zaxira kam bo'lsa - to'ldirish eslatma bering
- Sharhlardan e'tirozlarni yig'ib, sifat maslahatini bering
Javobni "Siz" deb murojaat qilib, Markdown formatda, emojilar bilan bering.`;

    let responseText = null;

    // =============================================
    // 1) TRY GROQ FIRST (Free, fast)
    // =============================================
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const groqModels = [
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
      ];

      for (const modelName of groqModels) {
        try {
          console.log(`[AI Advisor] Groq sinab ko'rilmoqda: ${modelName}...`);
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: dataForAI }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          });
          const text = completion.choices?.[0]?.message?.content;
          if (text) {
            responseText = text;
            console.log(`[AI Advisor] Groq muvaffaqiyatli: ${modelName}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Advisor] Groq xatolik ${modelName}:`, err.message);
        }
      }
    }

    // =============================================
    // 2) FALLBACK TO GEMINI
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
          console.log(`[AI Advisor] Gemini sinab ko'rilmoqda: ${modelName}...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: dataForAI }] }],
            config: { systemInstruction, temperature: 0.7 }
          });
          if (response && response.text) {
            responseText = response.text;
            console.log(`[AI Advisor] Gemini muvaffaqiyatli: ${modelName}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Advisor] Gemini xatolik ${modelName}:`, err.message);
          if (err.status === 401 || err.status === 403) break;
        }
      }
    }

    // =============================================
    // 3) LOCAL FALLBACK (always works, no AI)
    // =============================================
    if (responseText) {
      res.json({ advice: responseText });
    } else {
      console.warn('[AI Advisor] Barcha AI xizmatlari xato berdi. Lokal tahlil ishlatilmoqda.');
      const fallbackAdvice = generateLocalAdvice(craftsman, products);
      res.json({ advice: fallbackAdvice });
    }

  } catch (error) {
    console.error('[AI Advisor] Error:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.', error: error.message });
  }
});

export default router;
