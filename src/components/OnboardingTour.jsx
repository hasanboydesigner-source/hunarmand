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
  const [spotlightRect, setSpotlightRect] = useState(null);

  useEffect(() => {
    const done = localStorage.getItem('tour-v2-done');
    if (!done) {
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
    const gap = 14;

    let top, left;

    if (current.placement === 'top') {
      top = rect.top - gap + window.scrollY;
    } else {
      top = rect.bottom + gap + window.scrollY;
    }

    left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));

    setPos({ top, left, placement: current.placement });
    setSpotlightRect({
      top: rect.top - 6,
      left: rect.left - 6,
      width: rect.width + 12,
      height: rect.height + 12,
    });
    setReady(true);
  }, [step]);

  useEffect(() => {
    if (!visible) return;
    setReady(false);
    setSpotlightRect(null);
    const t = setTimeout(calcPos, 80);
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

  return (
    <>
      {/* Dark Overlay */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />

      {/* Spotlight */}
      {spotlightRect && (
        <div style={{
          position: 'fixed',
          top: spotlightRect.top,
          left: spotlightRect.left,
          width: spotlightRect.width,
          height: spotlightRect.height,
          borderRadius: 12,
          background: 'transparent',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          zIndex: 9001,
          pointerEvents: 'none',
          border: '2.5px solid #c97a22',
          animation: 'tourPulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: pos.placement === 'top'
            ? pos.top - 180 - 14
            : pos.top,
          left: pos.left,
          width: 300,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 2px 8px rgba(201,122,34,0.15)',
          zIndex: 9002,
          padding: '22px 20px 18px',
          animation: 'tourFadeIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          border: '1px solid rgba(201,122,34,0.15)',
        }}>
          {/* Arrow */}
          {pos.placement === 'bottom' && (
            <div style={{
              position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #fff',
              filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.06))',
            }} />
          )}
          {pos.placement === 'top' && (
            <div style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #fff',
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.06))',
            }} />
          )}

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>
              {current.title}
            </h3>
            <button onClick={finish} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 2, display: 'flex', flexShrink: 0, marginLeft: 8, borderRadius: 6, transition: 'color 0.15s' }}
              onMouseOver={e => e.currentTarget.style.color = '#888'}
              onMouseOut={e => e.currentTarget.style.color = '#bbb'}
            >
              <X size={15} />
            </button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13.5, color: '#666', lineHeight: 1.65, margin: '0 0 18px' }}>
            {current.description}
          </p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 22 : 6,
                height: 6,
                borderRadius: 99,
                background: i === step ? '#c97a22' : '#e8e8e8',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={finish}
              style={{ fontSize: 11.5, color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginRight: 'auto', letterSpacing: 0.2 }}
            >
              O'tkazib yuborish
            </button>
            {step > 0 && (
              <button onClick={prev} style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '7px 12px', borderRadius: 9, border: '1.5px solid #eee',
                background: '#fafafa', fontSize: 12.5, cursor: 'pointer', color: '#666',
                transition: 'border-color 0.15s',
              }}>
                <ChevronLeft size={13} /> Orqaga
              </button>
            )}
            <button
              onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 18px', borderRadius: 9,
                background: 'linear-gradient(135deg, #c97a22, #a0620f)',
                color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(201,122,34,0.38)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(201,122,34,0.48)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,122,34,0.38)'; }}
            >
              {step === STEPS.length - 1 ? '🚀 Boshlash!' : 'Keyingi'} {step < STEPS.length - 1 && <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tourPulse {
          0%, 100% { border-color: #c97a22; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 4px rgba(201,122,34,0.3); }
          50%       { border-color: #e8962a; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 8px rgba(201,122,34,0.1); }
        }
      `}</style>
    </>
  );
}
