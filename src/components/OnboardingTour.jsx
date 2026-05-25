import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Camera, Bot, Sparkles } from 'lucide-react';

const STEPS = [
  {
    targetId: 'search-btn',
    icon: Camera,
    iconColor: '#c97a22',
    gradientFrom: '#c97a22',
    gradientTo: '#f0a830',
    badge: 'YANGI',
    title: 'Rasm orqali qidirish',
    description: "Kerakli mahsulotni topish uchun faqat matn emas — rasm ham yuklay olasiz! AI kamera yoki galereyangizdan yuklangan rasm orqali o'xshash hunarmandchilik buyumlarini topib beradi.",
    placement: 'bottom',
  },
  {
    targetId: 'tour-chatbot-btn',
    icon: Bot,
    iconColor: '#7c3aed',
    gradientFrom: '#7c3aed',
    gradientTo: '#a855f7',
    badge: 'AI',
    title: 'Bepul AI Maslahatchi',
    description: "Qanday sovg'a tanlashni bilmayapsizmi? Bizning AI yordamchimiz sizga narx, material va hunarmand bo'yicha tavsiyalar beradi. Kun-u tun, bepul ishlaydi!",
    placement: 'top',
  },
];

function useElementRect(id, active) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!active) return;
    const update = () => {
      const el = document.getElementById(id);
      if (el) setRect(el.getBoundingClientRect());
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [id, active]);
  return rect;
}

const PAD = 10;
const TW = 340; // tooltip width
const TH = 260; // tooltip estimated height

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const done = localStorage.getItem('tour-v2-done');
    if (!done) {
      const t = setTimeout(() => setVisible(true), 1600);
      return () => clearTimeout(t);
    }
  }, []);

  const current = STEPS[step];
  const rect = useElementRect(current.targetId, visible);

  const finish = () => {
    setVisible(false);
    localStorage.setItem('tour-v2-done', 'true');
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  if (!visible || !rect) return null;

  // --- Tooltip position (fixed, viewport coords) ---
  let tooltipTop, tooltipLeft;

  if (current.placement === 'bottom') {
    tooltipTop = rect.bottom + PAD;
  } else {
    tooltipTop = rect.top - TH - PAD;
  }

  // Center horizontally over the element
  tooltipLeft = rect.left + rect.width / 2 - TW / 2;
  // Clamp to viewport
  tooltipLeft = Math.max(12, Math.min(tooltipLeft, window.innerWidth - TW - 12));
  // Keep tooltip in viewport vertically
  tooltipTop = Math.max(12, Math.min(tooltipTop, window.innerHeight - TH - 12));

  const IconComp = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* SVG Overlay with spotlight cutout */}
      <svg
        style={{
          position: 'fixed', inset: 0, width: '100%', height: '100%',
          zIndex: 9000, pointerEvents: 'none',
        }}
      >
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left - PAD}
              y={rect.top - PAD}
              width={rect.width + PAD * 2}
              height={rect.height + PAD * 2}
              rx="10"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%" height="100%"
          fill="rgba(10,12,20,0.72)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Spotlight border ring (clickable overlay for dismiss) */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', inset: 0, zIndex: 9001,
          cursor: 'default',
        }}
      />

      {/* Spotlight animated ring */}
      <div style={{
        position: 'fixed',
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: 10,
        border: `2px solid ${current.gradientFrom}`,
        zIndex: 9002,
        pointerEvents: 'none',
        animation: 'ringPulse 2s ease-in-out infinite',
        boxSizing: 'border-box',
      }} />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: TW,
          zIndex: 9003,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.28), 0 4px 20px rgba(0,0,0,0.15)',
          animation: 'tooltipIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: '#fff',
        }}
      >
        {/* Arrow pointing to element */}
        {current.placement === 'bottom' && rect.top + rect.height + PAD === tooltipTop && (
          <div style={{
            position: 'absolute', top: -7, left: TW / 2 - 7,
            width: 14, height: 14,
            background: current.gradientFrom,
            transform: 'rotate(45deg)',
            borderRadius: 2,
            zIndex: 1,
          }} />
        )}

        {/* Gradient Header */}
        <div style={{
          background: `linear-gradient(135deg, ${current.gradientFrom}, ${current.gradientTo})`,
          padding: '18px 18px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background blobs */}
          <div style={{ position: 'absolute', top: -24, right: -16, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconComp size={22} color="#fff" strokeWidth={1.8} />
              </div>

              {/* Title area */}
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.22)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  padding: '2px 7px',
                  borderRadius: 99,
                  textTransform: 'uppercase',
                  marginBottom: 5,
                  display: 'block',
                  width: 'fit-content',
                }}>
                  {current.badge}
                </span>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  {current.title}
                </h3>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={finish}
              style={{
                width: 30, height: 30,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px 18px', background: '#fff' }}>
          <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#555', lineHeight: 1.68 }}>
            {current.description}
          </p>

          {/* Step progress bar */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                height: 3,
                borderRadius: 99,
                flex: i === step ? 2.5 : 1,
                background: i <= step ? current.gradientFrom : '#f0f0f0',
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>

          {/* Step counter + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Step counter */}
            <span style={{ fontSize: 11.5, color: '#bbb', marginRight: 'auto' }}>
              {step + 1} / {STEPS.length}
            </span>

            {step > 0 && (
              <button
                onClick={prev}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '7px 13px', borderRadius: 9,
                  border: '1.5px solid #e8e8e8',
                  background: '#fafafa',
                  fontSize: 12.5, color: '#666', fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                <ChevronLeft size={13} /> Orqaga
              </button>
            )}

            <button
              onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 18px', borderRadius: 9,
                background: `linear-gradient(135deg, ${current.gradientFrom}, ${current.gradientTo})`,
                color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 5px 16px ${current.gradientFrom}55`,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isLast
                ? <><Sparkles size={13} /> Boshlash!</>
                : <>Keyingi <ChevronRight size={13} /></>
              }
            </button>
          </div>

          {/* Skip */}
          <button
            onClick={finish}
            style={{
              display: 'block', margin: '12px auto 0',
              background: 'none', border: 'none',
              fontSize: 11.5, color: '#ccc',
              cursor: 'pointer',
            }}
          >
            Qo'llanmani o'tkazib yuborish
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 3px rgba(201,122,34,0.2); }
          50%       { opacity: 0.6; box-shadow: 0 0 0 7px rgba(201,122,34,0.06); }
        }
      `}</style>
    </>
  );
}
