import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Camera, Bot, Sparkles } from 'lucide-react';

const STEPS = [
  {
    targetId: 'search-btn',
    icon: Camera,
    iconColor: '#c97a22',
    iconBg: '#fff7ed',
    badgeColor: '#c97a22',
    badgeBg: '#fff7ed',
    badge: 'Yangi imkoniyat',
    title: 'Rasm orqali qidirish',
    description: "Kerakli mahsulotni tez topish uchun uning rasmini yuklang. Sun'iy intellektimiz unga eng yaqin o'xshash milliy hunarmandchilik buyumlarini topib beradi.",
    placement: 'bottom',
  },
  {
    targetId: 'tour-chatbot-btn',
    icon: Bot,
    iconColor: '#2563eb',
    iconBg: '#eff6ff',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    badge: 'AI Maslahatchi',
    title: 'Sun\'iy intellekt yordamchisi',
    description: "Mahsulotlar, narxlar yoki materiallar haqida so'rang. Bizning virtual yordamchimiz kun-u tun sizga to'g'ri tanlov qilishda ko'maklashadi.",
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

const PAD = 8;
const TW = 320; // Tooltip width
const TH = 230; // Estimated tooltip height

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    // Dispatch custom event to notify chatbot
    window.dispatchEvent(new CustomEvent('onboarding-tour-finished'));
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  if (!visible || !rect) return null;

  // --- Tooltip positioning (Desktop) ---
  let tooltipTop = 0;
  let tooltipLeft = 0;

  if (!isMobile) {
    if (current.placement === 'bottom') {
      tooltipTop = rect.bottom + PAD;
    } else {
      tooltipTop = rect.top - TH - PAD;
    }

    // Center horizontally relative to target element
    tooltipLeft = rect.left + rect.width / 2 - TW / 2;

    // Viewport safety boundary clamping
    tooltipLeft = Math.max(12, Math.min(tooltipLeft, window.innerWidth - TW - 12));
    tooltipTop = Math.max(12, Math.min(tooltipTop, window.innerHeight - TH - 12));
  } else {
    // Mobile placement: top/bottom based on element viewport center
    const centerY = rect.top + rect.height / 2;
    if (centerY > window.innerHeight / 2) {
      tooltipTop = 16; // Top of the screen if element is in the bottom half
    } else {
      tooltipTop = window.innerHeight - 220 - 16; // Bottom of the screen if element is in the top half
    }
  }

  const IconComp = current.icon;
  const isLast = step === STEPS.length - 1;

  // Styling helpers
  const brandColor = '#c97a22';

  return (
    <>
      {/* SVG Overlay with clean cutout */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 9000,
          pointerEvents: 'none',
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
              rx="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(9, 9, 11, 0.55)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Dismiss overlay */}
      <div
        onClick={finish}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9001,
          cursor: 'default',
        }}
      />

      {/* Spotlight border ring - Minimalist, very subtle pulse */}
      <div style={{
        position: 'fixed',
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: 8,
        border: `1.5px solid ${brandColor}`,
        zIndex: 9002,
        pointerEvents: 'none',
        animation: 'spotlightPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        boxSizing: 'border-box',
      }} />

      {/* Tooltip Card */}
      <div
        ref={tooltipRef}
        onClick={e => e.stopPropagation()}
        style={
          isMobile
            ? {
                position: 'fixed',
                left: 12,
                right: 12,
                top: tooltipTop,
                zIndex: 9003,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05)',
                animation: 'tooltipIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                background: '#fff',
                border: '1px solid #e4e4e7',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
              }
            : {
                position: 'fixed',
                top: tooltipTop,
                left: tooltipLeft,
                width: TW,
                zIndex: 9003,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05)',
                animation: 'tooltipIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                background: '#fff',
                border: '1px solid #e4e4e7',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
              }
        }
      >
        {/* Little pointer arrow (Desktop only) */}
        {!isMobile && current.placement === 'bottom' && (
          <div style={{
            position: 'absolute',
            top: -6,
            left: TW / 2 - 6,
            width: 12,
            height: 12,
            background: '#fff',
            borderTop: '1px solid #e4e4e7',
            borderLeft: '1px solid #e4e4e7',
            transform: 'rotate(45deg)',
            zIndex: 1,
          }} />
        )}
        {!isMobile && current.placement === 'top' && (
          <div style={{
            position: 'absolute',
            bottom: -6,
            left: TW / 2 - 6,
            width: 12,
            height: 12,
            background: '#fff',
            borderBottom: '1px solid #e4e4e7',
            borderRight: '1px solid #e4e4e7',
            transform: 'rotate(45deg)',
            zIndex: 1,
          }} />
        )}

        {/* Minimalist Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Clean Icon Wrapper */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: current.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconComp size={18} color={current.iconColor} strokeWidth={2} />
            </div>

            <div>
              {/* Badge */}
              <span style={{
                display: 'inline-block',
                background: current.badgeBg,
                color: current.badgeColor,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: 0.5,
                padding: '2px 8px',
                borderRadius: 99,
                marginBottom: 3,
              }}>
                {current.badge}
              </span>
              {/* Title */}
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: '#18181b', lineHeight: 1.25 }}>
                {current.title}
              </h3>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={finish}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f4f4f5';
              e.currentTarget.style.color = '#71717a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#a1a1aa';
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body */}
        <p style={{
          margin: '0 0 14px',
          fontSize: 13,
          color: '#52525b',
          lineHeight: 1.6,
          fontWeight: 400,
        }}>
          {current.description}
        </p>

        {/* Step Indicator (Lines) */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height: 3,
              borderRadius: 2,
              flex: i === step ? 2 : 1,
              background: i === step ? brandColor : '#e4e4e7',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          {/* Counter */}
          <span style={{ fontSize: 11.5, color: '#a1a1aa', marginRight: 'auto', fontWeight: 500 }}>
            {step + 1} / {STEPS.length}
          </span>

          {step > 0 && (
            <button
              onClick={prev}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #e4e4e7',
                background: '#ffffff',
                fontSize: 12,
                color: '#27272a',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
            >
              <ChevronLeft size={13} /> Orqaga
            </button>
          )}

          <button
            onClick={next}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '7px 16px',
              borderRadius: 8,
              background: brandColor,
              color: '#ffffff',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#b45309'; }}
            onMouseLeave={e => { e.currentTarget.style.background = brandColor; }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isLast ? (
              <><Sparkles size={13} /> Boshlash</>
            ) : (
              <>Keyingi <ChevronRight size={13} /></>
            )}
          </button>
        </div>

        {/* Skip button */}
        <button
          onClick={finish}
          style={{
            alignSelf: 'center',
            background: 'none',
            border: 'none',
            fontSize: 11,
            color: '#a1a1aa',
            cursor: 'pointer',
            marginTop: 10,
            fontWeight: 500,
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.textDecoration = 'none'; }}
        >
          Qo'llanmani o'tkazib yuborish
        </button>
      </div>

      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spotlightPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 1px rgba(201, 122, 34, 0.2); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(201, 122, 34, 0.08); }
        }
      `}</style>
    </>
  );
}
