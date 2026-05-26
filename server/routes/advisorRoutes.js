import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Local fallback advice generator
const generateLocalAdvice = (craftsman, products, orders, period) => {
  let totalViews = 0, totalSold = 0;
  let lowStockProducts = [], highViewLowSaleProducts = [];
  let bestSeller = null, maxSold = -1;

  products.forEach(p => {
    totalViews += p.views || 0;
    totalSold += p.sold || 0;
    if (p.inStock <= 5) lowStockProducts.push(p.title);
    if ((p.views || 0) > 20 && (p.sold || 0) === 0) highViewLowSaleProducts.push(p.title);
    if ((p.sold || 0) > maxSold) { maxSold = p.sold || 0; bestSeller = p.title; }
  });

  const periodLabel = period === 'daily' ? 'bugungi' : period === 'weekly' ? 'haftalik' : 'umumiy';
  const orderRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  return `### 📊 ${periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1)} AI Biznes Tahlil Hisoboti

Salom, **${craftsman.name}**! Sizning do'koningiz statistikasi asosida tayyorlangan tahlil:

---

#### 📈 Ko'rsatkichlar (${periodLabel} davr)
* **Jami mahsulotlar:** ${products.length} tur
* **Ko'rishlar:** ${totalViews} marta
* **Sotilgan:** ${totalSold} ta
* **Buyurtmalar:** ${orders.length} ta
* **Daromad:** ${orderRevenue.toLocaleString()} so'm
* **Konversiya:** ${totalViews > 0 ? ((totalSold / totalViews) * 100).toFixed(1) : 0}%

---

#### 🌟 Tavsiyalar:

${bestSeller && maxSold > 0 ? `1. **🔥 Top Mahsulot:** "${bestSeller}" — ${maxSold} ta sotildi. Zaxirani to'ldirib qo'ying.` : ''}
${lowStockProducts.length > 0 ? `2. **⚠️ Zaxira Kam:** ${lowStockProducts.join(', ')} — kamida 10-15 taga yetkazing.` : ''}
${highViewLowSaleProducts.length > 0 ? `3. **🔍 Konversiya past:** ${highViewLowSaleProducts.join(', ')} — narxni 5-10% tushirib ko'ring yoki rasmlarni yangilang.` : ''}
4. **💬 Sharhlar:** Xaridorlar sharhlariga javob bering — bu ishonchni oshiradi.
5. **🚀 Strategiya:** Ijtimoiy tarmoqlarda mahsulot tayyorlanish jarayonini ko'rsating.

*Biznesingizga muvaffaqiyatlar! 💼✨*`;
};

// @route   GET /api/advisor/:craftsmanId?period=daily|weekly|overall
router.get('/:craftsmanId', async (req, res) => {
  try {
    const { craftsmanId } = req.params;
    const period = req.query.period || 'overall'; // 'daily' | 'weekly' | 'overall'

    if (!craftsmanId || !/^[0-9a-fA-F]{24}$/.test(craftsmanId)) {
      return res.status(400).json({ message: "Noto'g'ri hunarmand ID." });
    }

    const craftsman = await User.findById(craftsmanId);
    if (!craftsman || craftsman.role !== 'craftsman') {
      return res.status(404).json({ message: "Hunarmand topilmadi." });
    }

    const products = await Product.find({ craftsman: craftsmanId });
    if (products.length === 0) {
      return res.json({ advice: "Sizda hali mahsulotlar yo'q. Dastlab mahsulot qo'shing va savdoni boshlang!" });
    }

    // ── Date filter for orders ──
    let dateFilter = {};
    const now = new Date();
    if (period === 'daily') {
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: dayStart } };
    } else if (period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekStart } };
    }

    const orders = await Order.find({ craftsmanId, ...dateFilter });

    // ── Build stats ──
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    let totalViews = 0, totalSold = 0;
    products.forEach(p => { totalViews += p.views || 0; totalSold += p.sold || 0; });

    const periodLabel = period === 'daily' ? 'BUGUNGI' : period === 'weekly' ? 'HAFTALIK (so\'nggi 7 kun)' : 'UMUMIY';

    // ── AI Prompt ──
    const dataForAI = `
Hunarmand: ${craftsman.name} | Do'kon: ${craftsman.shopName || craftsman.name}
Tahlil davri: ${periodLabel}

═══ MAHSULOTLAR STATISTIKASI ═══
${products.map((p, i) => `
${i + 1}. "${p.title}"
   Narx: ${p.price} so'm | Zaxira: ${p.inStock} ta | Sotildi: ${p.sold} ta | Ko'rishlar: ${p.views} marta
   ${p.reviews?.length > 0 ? `Sharhlar (${p.reviews.length} ta): ${p.reviews.slice(0, 3).map(r => `${r.rating}/5 — "${r.text?.slice(0, 60)}"`).join('; ')}` : 'Sharhlar yo\'q'}
`).join('')}

═══ BUYURTMALAR STATISTIKASI (${periodLabel}) ═══
Jami buyurtmalar: ${totalOrders} ta
Kutilmoqda: ${pendingOrders} ta | Yetkazildi: ${deliveredOrders} ta | Bekor: ${cancelledOrders} ta
Jami daromad: ${totalRevenue.toLocaleString()} so'm
Jami ko'rishlar: ${totalViews} | Jami sotilgan: ${totalSold} ta
Konversiya: ${totalViews > 0 ? ((totalSold / totalViews) * 100).toFixed(2) : 0}%
`;

    const systemInstruction = `Sen "E-Hunarmand" elektron tijorat platformasining SENIOR AI Biznes Maslahatchi'sisisan.

VAZIFANG:
Hunarmandning ${periodLabel} statistikasini CHUQUR tahlil qilib, aniq, amaliy va foydali maslahatlar ber.

TAHLIL TUZILMASI (bu tartibda yoz):
1. 📊 Davriy Tahlil Xulosasi — raqamlar bilan qisqa xulosa
2. 🔥 Kuchli Tomonlar — nima yaxshi ishlayapti
3. ⚠️ Muammolar — nima yaxshilanishi kerak (raqamlar asosida)
4. 🎯 Amaliy Qadamlar — 3-5 ta ANIQ harakat (masalan: "X mahsulot narxini Y so'mga tushiring")
5. 💡 Strategik Tavsiya — bu davr uchun eng muhim 1 ta strategik qadam

USLUB:
- O'ZBEK tilida yoz, grammatik xatosiz
- Har bir tavsiya ANIQ va AMALIY bo'lsin (umumiy gap emas)
- Markdown formatdan foydalan
- "Siz" deb murojaat qil
- Raqamlarni ko'p ishlatiz`;

    let responseText = null;

    // ── 1) GROQ ──
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const groqModels = [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'gemma2-9b-it',
      ];
      for (const modelName of groqModels) {
        try {
          console.log(`[Advisor] Groq: ${modelName}...`);
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: dataForAI }
            ],
            temperature: 0.5,
            max_tokens: 2000,
          });
          const text = completion.choices?.[0]?.message?.content;
          if (text) { responseText = text; console.log(`[Advisor] Groq OK: ${modelName}`); break; }
        } catch (err) {
          console.warn(`[Advisor] Groq xatolik ${modelName}:`, err.message);
        }
      }
    }

    // ── 2) GEMINI fallback ──
    if (!responseText && process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const geminiModels = [
        'gemini-2.5-flash-preview-05-20',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
      ];
      for (const modelName of geminiModels) {
        try {
          console.log(`[Advisor] Gemini: ${modelName}...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: dataForAI }] }],
            config: { systemInstruction, temperature: 0.5 }
          });
          if (response?.text) {
            responseText = response.text;
            console.log(`[Advisor] Gemini OK: ${modelName}`);
            break;
          }
        } catch (err) {
          console.warn(`[Advisor] Gemini xatolik ${modelName}:`, err.message);
          if (err.status === 401 || err.status === 403) break;
        }
      }
    }

    // ── 3) Local fallback ──
    if (responseText) {
      res.json({ advice: responseText, stats: { totalOrders, totalRevenue, pendingOrders, deliveredOrders, totalViews, totalSold } });
    } else {
      const fallbackAdvice = generateLocalAdvice(craftsman, products, orders, period);
      res.json({ advice: fallbackAdvice, stats: { totalOrders, totalRevenue, pendingOrders, deliveredOrders, totalViews, totalSold } });
    }

  } catch (error) {
    console.error('[Advisor] Error:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.', error: error.message });
  }
});

export default router;
