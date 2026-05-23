import React from 'react';
import { ScrollText, CheckSquare, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="page-with-header" style={{ padding: '60px 0', background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container legal-container">
        <div className="legal-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <ScrollText size={48} color="var(--brand-500)" style={{ margin: '0 auto 16px' }} />
          <h1>Foydalanish Shartlari</h1>
          <p style={{ color: 'var(--text-muted)' }}>Amal qilish muddati: 23-May 2026-yildan boshlab</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          
          <section className="legal-section">
            <h2>
              <CheckSquare size={20} color="var(--brand-500)" /> 1. Umumiy Qoidalar
            </h2>
            <p>
              E-Hunarmand platformasidan foydalanish orqali siz ushbu shartlarga to'liq rozi ekanligingizni bildirasiz. Platforma O'zbekiston Respublikasi qonunchiligi asosida faoliyat yuritadi va foydalanuvchilar o'rtasidagi oldi-sotdi jarayonlarini yengillashtirish uchun xizmat qiladi.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              <Scale size={20} color="var(--brand-500)" /> 2. Hunarmandlar va Xaridorlar majburiyatlari
            </h2>
            <p>
              <strong>Hunarmandlar:</strong> Platformaga faqat haqiqiy, sifatli va qonun bilan taqiqlanmagan o'z qo'l mehnati mahsulotlarini joylashtirishi shart. Mahsulot rasmlari va tavsiflari haqiqatga mos kelishi kerak.
              <br/><br/>
              <strong>Xaridorlar:</strong> Buyurtma berishda to'g'ri ma'lumotlarni ko'rsatishi va buyurtma tasdiqlangach to'lovni o'z vaqtida amalga oshirishi shart.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              <AlertTriangle size={20} color="var(--brand-500)" /> 3. Mahsulotni qaytarish va Bekor qilish
            </h2>
            <p>
              Xaridor sifatsiz yoxud rasmda ko'rsatilganidan farq qiluvchi mahsulotni olgan kundan boshlab 3 kun ichida qaytarish huquqiga ega. Individual (maxsus) buyurtma asosida yasalgan mahsulotlar uzrli sabab bo'lmasa, qaytarib olinmaydi.
            </p>
          </section>

          <section className="legal-section">
            <h2>
              4. Intellektual Mulk
            </h2>
            <p>
              Saytdagi barcha kontentlar (logotip, dizayn, matnlar) E-Hunarmand mulki hisoblanadi. Hunarmandlar tomonidan yuklangan rasmlar ularning shaxsiy mulki bo'lib, E-Hunarmand platformasi ularni reklama maqsadida foydalanish huquqiga ega.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
