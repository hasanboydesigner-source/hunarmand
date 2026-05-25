import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    targetId: 'search-btn',
    title: '📸 Rasm orqali qidirish!',
    description: "Kerakli mahsulotni topish uchun faqat matn yozmang — telefon kamerangiz yoki galereyadan rasm yuklang. AI rasm orqali eng o'xshash hunarmand buyumlarini topib beradi!",
    placement: 'bottom',
  },
  {
    targetId: 'tour-chatbot-btn',
    title: '🤖 AI Maslahatchi',
    description: "Qanday sovg'a tanlashni bilmayapsizmi? Bizning AI yordamchimizdan so'rang! U sizga narx, material va hunarmand bo'yicha bepul tavsiyalar beradi — kun-u tun ishlaydi!",
    placement: 'top',
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('tour-v2-done');
    if (!done) {
      // Sahifa to'liq yuklanganidan keyin boshlash
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const calcPos = useCallback(() => {
    const current = STEPS[step];
    const el = document.getElementById(current.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipW = 300;
    const tooltipH = 180;
    const gap = 12;

    let top = rect.bottom + gap + window.scrollY;
    let left = rect.left + rect.width / 2 - tooltipW / 2;

    if (current.placement === 'top') {
      top = rect.top - tooltipH - gap + window.scrollY;
    }

    // Ekrandan tashqariga chiqmasligi
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));

    setPos({ top, left });
    setReady(true);
  }, [step]);

  useEffect(() => {
    if (!visible) return;
    setReady(false);
    const t = setTimeout(calcPos, 50);
    window.addEventListener('resize', calcPos);
    return () => { clearTimeout(t); window.removeEventListener('resize', calcPos); };
  }, [visible, step, calcPos]);

  const finish = () => {
    setVisible(false);
    localStorage.setItem('tour-v2-done', 'true');
  };

  const next = () => {
    if (step < STEPS.length - 1) { setReady(false); setStep(s => s + 1); }
    else finish();
  };

  const prev = () => {
    if (step > 0) { setReady(false); setStep(s => s - 1); }
  };

  if (!visible) return null;

  const current = STEPS[step];
  const el = document.getElementById(current.targetId);
  const rect = el?.getBoundingClientRect();

  return (
    <>
      {/* Dark Overlay */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Spotlight cutout */}
      {rect && (
        <div style={{
          position: 'fixed',
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: 12,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          zIndex: 9001,
          pointerEvents: 'none',
          border: '2px solid #c97a22',
          animation: 'pulse-border 2s infinite',
        }} />
      )}

      {/* Tooltip */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: 300,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          zIndex: 9002,
          padding: '20px',
          animation: 'tourFadeIn 0.3s ease-out',
          border: '1px solid #f0f0f0',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>
              {current.title}
            </h3>
            <button onClick={finish} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0, marginLeft: 8 }}>
              <X size={16} />
            </button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.6, margin: '0 0 16px' }}>
            {current.description}
          </p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === step ? '#c97a22' : '#e5e7eb',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={finish}
              style={{ fontSize: 12, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', marginRight: 'auto' }}
            >
              O'tkazib yuborish
            </button>
            {step > 0 && (
              <button onClick={prev} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#555' }}>
                <ChevronLeft size={14} /> Orqaga
              </button>
            )}
            <button
              onClick={next}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #c97a22, #b45309)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,122,34,0.4)' }}
            >
              {step === STEPS.length - 1 ? 'Boshlash!' : 'Keyingi'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 4px rgba(201,122,34,0.4); }
          50%       { box-shadow: 0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 8px rgba(201,122,34,0.15); }
        }
      `}</style>
    </>
  );
}
