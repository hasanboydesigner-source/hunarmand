import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Helper to generate professional local business advice in case of API issues
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
    if (p.inStock <= 5) {
      lowStockProducts.push(p.title);
    }
    if ((p.views || 0) > 20 && (p.sold || 0) === 0) {
      highViewLowSaleProducts.push(p.title);
    }
    if ((p.sold || 0) > maxSold) {
      maxSold = p.sold || 0;
      bestSeller = p.title;
    }
  });

  return `### 📊 Shaxsiy AI Biznes Tahlil Hisoboti

Salom, **${craftsman.name}**! Sizning do'koningiz va mahsulotlaringiz statistikasi asosida tayyorlangan tahlil va biznes tavsiyalari bilan tanishing.

---

#### 📈 Savdo va Faollik Ko'rsatkichlari
* **Jami mahsulotlaringiz:** ${products.length} turdagi mahsulot
* **Umumiy ko'rishlar soni:** ${totalViews} marta
* **Umumiy sotilgan mahsulotlar:** ${totalSold} ta mahsulot
* **O'rtacha konversiya ko'rsatkichi:** ${totalViews > 0 ? ((totalSold / totalViews) * 100).toFixed(1) : 0}%

---

#### 🌟 Mahsulotlar Tahlili va Amaliy Tavsiyalar:

${bestSeller && maxSold > 0 ? `1. **🔥 Top Mahsulot (Best Seller):**
   - **"${bestSeller}"** mahsuloti ${maxSold} marta sotilib, eng ommabop mahsulotingizga aylandi!
   - *Tavsiya:* Ushbu mahsulotning sifatini saqlab qoling va zaxirasi doim yetarli bo'lishini ta'minlang. Mijozlar ehtiyojidan kelib chiqib, shunga o'xshash yangi rang yoki variantlarni ham qo'shishingiz mumkin.` : ''}

${lowStockProducts.length > 0 ? `2. **⚠️ Zaxirani Yangilash Zarur:**
   - Quyidagi mahsulotlar zaxirada juda kam qolgan: *${lowStockProducts.join(', ')}*.
   - *Tavsiya:* Ushbu mahsulotlarga talab bor. Savdolarda uzilishlar bo'lmasligi uchun ombordagi zaxirani tezroq kamida 10-15 taga yetkazib qo'yishingizni maslahat beramiz.` : ''}

${highViewLowSaleProducts.length > 0 ? `3. **🔍 Ko'rishlar Bor, Lekin Sotuv Yo'q:**
   - Quyidagi mahsulotlar ko'p ko'rilmoqda, ammo hali sotilmagan: *${highViewLowSaleProducts.join(', ')}*.
   - *Tavsiya:* Mijozlar mahsulotga qiziqishmoqda, biroq xaridga kelganda ikkilanishmoqda. Bunga mahsulot narxi biroz yuqoriligi yoki tavsifining kamligi sabab bo'lishi mumkin. **Narxni 5-10% ga tushirib ko'ring** yoki mahsulot rasmini jozibaliroq va yorqinroq rasmlarga almashtiring.` : ''}

4. **💬 Xaridorlar bilan Aloqa va Sharhlar:**
   - Sharhlar va baholar do'koningiz reytingiga bevosita ta'sir qiladi. Har bir refreshingizda yangi sharhlar qo'shilsa, ularga samimiy javob qaytarishni unutmang. Bu mijozlarda do'koningizga nisbatan ishonchni oshiradi.

5. **🚀 Umumiy Biznes Strategiyasi:**
   - Yangi mahsulotlar qo'shganda, ularning materiallari va tayyorlanish muddati haqida batafsil yozing.
   - Ijtimoiy tarmoqlardagi sahifalaringizda mahsulotlaringizning tayyorlanish jarayonidan qisqa videolar ulashing. Bu orqali do'konga yangi xaridorlarni jalb qilishingiz mumkin.

*Biznesingiz rivojida muvaffaqiyatlar tilaymiz! Savdolaringiz barakali bo'lsin!* 💼✨`;
};

// @route   GET /api/advisor/:craftsmanId
// @desc    Get AI business advice based on craftsman's products
router.get('/:craftsmanId', async (req, res) => {
  try {
    const craftsmanId = req.params.craftsmanId;
    
    // Validate if craftsmanId is a valid MongoDB ObjectId
    if (!craftsmanId || !/^[0-9a-fA-F]{24}$/.test(craftsmanId)) {
      return res.status(400).json({ message: "Noto'g'ri hunarmand ID raqami." });
    }

    const craftsman = await User.findById(craftsmanId);

    if (!craftsman || craftsman.role !== 'craftsman') {
      return res.status(404).json({ message: "Hunarmand topilmadi." });
    }

    // Fetch products
    const products = await Product.find({ craftsman: craftsmanId });

    if (products.length === 0) {
      return res.json({ advice: "Sizda hali mahsulotlar yo'q. Dastlab mahsulot qo'shing va savdoni boshlang!" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("[AI Advisor] Gemini API key not found. Using fallback advice.");
      const fallbackAdvice = generateLocalAdvice(craftsman, products);
      return res.json({ advice: fallbackAdvice });
    }

    // Prepare data for AI
    let dataForAI = `Hunarmand ismi: ${craftsman.name}\n\nQuyida hunarmandning mahsulotlari statistikasi va sharhlari keltirilgan:\n`;

    products.forEach((p, index) => {
      dataForAI += `\n${index + 1}. Mahsulot: ${p.title}
- Narxi: ${p.price} so'm
- Zaxirada (inStock): ${p.inStock} ta
- Necha marta sotildi (sold): ${p.sold} ta
- Necha marta ko'rildi (views): ${p.views} marta
`;
      if (p.reviews && p.reviews.length > 0) {
        dataForAI += `- Xaridorlar sharhlari:\n`;
        p.reviews.forEach(r => {
          dataForAI += `  * Reyting: ${r.rating}/5, Izoh: "${r.text}"\n`;
        });
      } else {
        dataForAI += `- Xaridorlar sharhlari: Hali sharhlar yo'q.\n`;
      }
    });

    const systemInstruction = `Siz elektron tijorat platformasidagi (Hunarmandchilik do'koni) 'Senior AI Biznes Maslahatchi'siz.
Sizning vazifangiz: Hunarmandning mahsulotlari statistikasini (ko'rilishlar, sotilishlar, zaxira va xaridor sharhlari) chuqur tahlil qilib, unga savdoni oshirish bo'yicha amaliy va strategik maslahatlar berish.
Masalan: 
- Agar mahsulot ko'p marta ko'rilgan (views yuqori) lekin sotilmagan (sold 0 yoki kam) bo'lsa, narxni tushirishni yoki rasmlarni yaxshilashni maslahat bering.
- Agar mahsulot yaxshi sotilayotgan bo'lsa va zaxirada (inStock) kam qolgan bo'lsa, zaxirani tezroq to'ldirishni eslating.
- Xaridorlar sharhidagi e'tirozlarni (agar bo'lsa) yig'ib, sifatni yoki qadoqlashni yaxshilashni maslahat bering.
- Trenddagi mahsulotlardan ko'proq ishlab chiqarishni taklif qiling.

Javobingizni to'g'ridan-to'g'ri, samimiy va ishonchli ohangda "Siz" deb murojaat qilib bering. Format Markdown bo'linger kerak. Emojilardan o'rinli foydalaning. Maslahatlar aniq va tushunarli bo'lsin.`;

    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-8b'
    ];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      console.log(`[AI Advisor] Analyzing data for ${craftsman.name}...`);
      
      let responseText = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`[AI Advisor] Trying model: ${modelName}...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [{ text: dataForAI }]
              }
            ],
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
          
          if (response && response.text) {
            responseText = response.text;
            console.log(`[AI Advisor] Muaffaqiyatli: ${modelName} orqali tahlil olindi.`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Advisor] Xatolik: ${modelName} modelida muammo:`, err.message);
          lastError = err;
        }
      }

      if (responseText) {
        res.json({ advice: responseText });
      } else {
        console.warn("[AI Advisor] Barcha modellar xato berdi! Fallback ishlatilmoqda. Xato:", lastError ? lastError.message : "Noma'lum xato");
        const fallbackAdvice = generateLocalAdvice(craftsman, products);
        res.json({ advice: fallbackAdvice });
      }
    } catch (apiErr) {
      console.error("[AI Advisor] Gemini API error (using fallback):", apiErr.message || apiErr);
      const fallbackAdvice = generateLocalAdvice(craftsman, products);
      res.json({ advice: fallbackAdvice });
    }

  } catch (error) {
    console.error('[AI Advisor] Error:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.', error: error.message, stack: error.stack });
  }
});

export default router;
