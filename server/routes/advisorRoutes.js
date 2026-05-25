import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// @route   GET /api/advisor/:craftsmanId
// @desc    Get AI business advice based on craftsman's products
router.get('/:craftsmanId', async (req, res) => {
  try {
    const craftsmanId = req.params.craftsmanId;
    const craftsman = await User.findById(craftsmanId);

    if (!craftsman || craftsman.role !== 'craftsman') {
      return res.status(404).json({ message: "Hunarmand topilmadi." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API kaliti topilmadi." });
    }

    // Fetch products
    const products = await Product.find({ craftsman: craftsmanId });

    if (products.length === 0) {
      return res.json({ advice: "Sizda hali mahsulotlar yo'q. Dastlab mahsulot qo'shing va savdoni boshlang!" });
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

Javobingizni to'g'ridan-to'g'ri, samimiy va ishonchli ohangda "Siz" deb murojaat qilib bering. Format Markdown bo'lishi kerak. Emojilardan o'rinli foydalaning. Maslahatlar aniq va tushunarli bo'lsin.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    console.log(`[AI Advisor] Analyzing data for ${craftsman.name}...`);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
      res.json({ advice: response.text });
    } else {
      res.status(500).json({ message: 'AI tahlil qila olmadi.' });
    }

  } catch (error) {
    console.error('[AI Advisor] Error:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
});

export default router;
