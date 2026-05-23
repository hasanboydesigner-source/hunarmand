import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="page-with-header" style={{ padding: '60px 0', background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container legal-container">
        <div className="legal-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <ShieldCheck size={48} color="var(--brand-500)" style={{ margin: '0 auto 16px' }} />
          <h1>Maxfiylik Siyosati</h1>
          <p style={{ color: 'var(--text-muted)' }}>Oxirgi yangilangan sana: 23-May 2026-yil</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          
          <section className="legal-section">
            <h2>
              <Eye size={20} color="var(--brand-500)" /> 1. Ma'lumotlarni yig'ish
            </h2>
            <p>
              Biz sizning shaxsiy ma'lumotlaringizni, jumladan ismingiz, elektron pochta manzilingiz, telefon raqamingiz va manzilingizni faqat xizmatingizni yaxshilash maqsadida yig'amiz. Ushbu ma'lumotlar faqat sizning roziligingiz bilan olinadi va platformamizda ro'yxatdan o'tganingizda yoki xaridni amalga oshirganingizda so'raladi.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              <Lock size={20} color="var(--brand-500)" /> 2. Ma'lumotlar xavfsizligi
            </h2>
            <p>
              Sizning ma'lumotlaringiz E-Hunarmand platformasi tomonidan zamonaviy shifrlash texnologiyalari (SSL) yordamida himoyalangan. To'lov ma'lumotlari (karta raqamlari) bizning serverlarda saqlanmaydi va bevosita ishonchli to'lov tizimlari (Payme, Click) orqali qayta ishlanadi.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              <FileText size={20} color="var(--brand-500)" /> 3. Ma'lumotlarni uchinchi shaxslarga berish
            </h2>
            <p>
              Biz sizning shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz yoki ruxsatsiz bermaymiz. Biroq, buyurtmani yetkazib berish maqsadida ba'zi zarur ma'lumotlar (ism, manzil, telefon) logistika hamkorlarimiz va xarid qilingan hunarmandlarga taqdim etilishi mumkin.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              4. Cookie fayllari
            </h2>
            <p>
              Platformamiz foydalanuvchi tajribasini yaxshilash maqsadida "Cookie" fayllaridan foydalanadi. Ular sizning tizimga kirganlik holatingizni eslab qolish va sayt tahlilini olib borish uchun ishlatiladi. Siz istalgan vaqtda brauzeringiz sozlamalari orqali cookie fayllarini o'chirib qo'yishingiz mumkin.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              5. O'zgartirishlar
            </h2>
            <p>
              Ushbu Maxfiylik siyosati vaqti-vaqti bilan yangilanishi mumkin. Har qanday o'zgarishlar ushbu sahifada e'lon qilinadi va muhim o'zgarishlar haqida sizga elektron pochta orqali xabar beriladi.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
