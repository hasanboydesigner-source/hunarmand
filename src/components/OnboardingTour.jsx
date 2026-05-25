import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Camera, Bot, Sparkles } from 'lucide-react';

const STEPS = [
  {
    targetId: 'search-btn',
    icon: <Camera size={22} color="#fff" />,
    iconBg: 'linear-gradient(135deg, #c97a22, #e8962a)',
    badge: 'Yangi!',
    title: 'Rasm orqali qidirish',
    description: "Kerakli mahsulotni topish uchun faqat matn yozmang — telefon kamerangiz yoki galereyadan rasm yuklang. AI rasm orqali eng o'xshash hunarmand buyumlarini topib beradi!",
    placement: 'bottom',
  },
  {
    targetId: 'tour-chatbot-btn',
    icon: <Bot size={22} color="#fff" />,
    iconBg: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    badge: 'AI',
    title: 'Aqlli Maslahatchi',
    description: "Qanday sovg'a tanlashni bilmayapsizmi? Bizning AI yordamchimizdan so'rang! U sizga narx, material va hunarmand bo'yicha bepul tavsiyalar beradi — kun-u tun ishlaydi!",
    placement: 'top',
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'bottom' });
  const [ready, setReady] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState(null);

  useEffect(() => {
    const done = localStorage.getItem('tour-v2-done');
    if (!done) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const calcPos = useCallback(() => {
    const current = STEPS[step];
    const el = document.getElementById(current.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipW = 320;
    const gap = 16;

    let top = current.placement === 'top'
      ? rect.top - gap + window.scrollY
      : rect.bottom + gap + window.scrollY;

    let left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));

    setPos({ top, left, placement: current.placement });
    setSpotlightRect({
      top: rect.top - 8,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16,
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
  const tooltipH = 220;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(10,10,20,0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
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
          borderRadius: 14,
          background: 'transparent',
          boxShadow: '0 0 0 9999px rgba(10,10,20,0.65)',
          zIndex: 9001,
          pointerEvents: 'none',
          border: '2px solid rgba(201,122,34,0.8)',
          animation: 'tourPulse 2.2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: pos.placement === 'top' ? pos.top - tooltipH - 14 : pos.top,
          left: pos.left,
          width: 320,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 32px 80px rgba(0,0,0,0.2), 0 4px 16px rgba(201,122,34,0.12)',
          zIndex: 9002,
          overflow: 'hidden',
          animation: 'tourFadeIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {/* Colored Header */}
          <div style={{
            background: current.iconBg,
            padding: '20px 20px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            <div style={{
              position: 'absolute', bottom: -30, right: 20,
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Icon container */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  {current.icon}
                </div>
                <div>
                  {/* Badge */}
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.25)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    padding: '2px 8px',
                    borderRadius: 99,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                    {current.badge}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                    {current.title}
                  </h3>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={finish}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: '#fff',
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Arrow connecting header to tooltip */}
          {pos.placement === 'bottom' && (
            <div style={{
              position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderBottom: `9px solid ${step === 0 ? '#c97a22' : '#7c3aed'}`,
            }} />
          )}
          {pos.placement === 'top' && (
            <div style={{
              position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderTop: '9px solid #fff',
            }} />
          )}

          {/* Body */}
          <div style={{ padding: '16px 20px 18px' }}>
            <p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.7, margin: '0 0 16px' }}>
              {current.description}
            </p>

            {/* Progress */}
            <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 4,
                  flex: i === step ? 2 : 1,
                  borderRadius: 99,
                  background: i === step
                    ? (step === 0 ? '#c97a22' : '#7c3aed')
                    : i < step ? '#e5e7eb' : '#f3f4f6',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }} />
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={finish}
                style={{
                  fontSize: 11.5, color: '#ccc', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '4px 0', marginRight: 'auto',
                }}
              >
                O'tkazib yuborish
              </button>

              {step > 0 && (
                <button onClick={prev} style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  padding: '8px 13px', borderRadius: 10,
                  border: '1.5px solid #eee', background: '#fafafa',
                  fontSize: 12.5, cursor: 'pointer', color: '#666',
                  fontWeight: 500,
                }}>
                  <ChevronLeft size={13} /> Orqaga
                </button>
              )}

              <button
                onClick={next}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '9px 20px', borderRadius: 10,
                  background: current.iconBg,
                  color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: step === 0
                    ? '0 6px 16px rgba(201,122,34,0.4)'
                    : '0 6px 16px rgba(124,58,237,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {step === STEPS.length - 1
                  ? <><Sparkles size={14} /> Boshlash!</>
                  : <>Keyingi <ChevronRight size={13} /></>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tourPulse {
          0%, 100% { border-color: rgba(201,122,34,0.9); box-shadow: 0 0 0 9999px rgba(10,10,20,0.65), 0 0 0 5px rgba(201,122,34,0.25); }
          50%       { border-color: rgba(201,122,34,0.5); box-shadow: 0 0 0 9999px rgba(10,10,20,0.65), 0 0 0 10px rgba(201,122,34,0.08); }
        }
      `}</style>
    </>
  );
}
