import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles, TrendingUp, AlertCircle, Bot, Calendar,
  ShoppingBag, Eye, Package, DollarSign, RefreshCw,
  ChevronRight, BarChart2, Zap, Clock
} from 'lucide-react';
import { API_URL } from '../../data/constants';
import ReactMarkdown from 'react-markdown';

const PERIODS = [
  { id: 'daily',   label: 'Bugungi',  icon: Clock,     desc: "Bugungi savdo ko'rsatkichlari" },
  { id: 'weekly',  label: 'Haftalik', icon: Calendar,  desc: "So'nggi 7 kunlik natijalar" },
  { id: 'overall', label: 'Umumiy',   icon: BarChart2, desc: "Barcha vaqt davridagi statistika" },
];

const LOADING_STEPS = [
  'Mahsulotlar tahlil qilinmoqda...',
  'Buyurtmalar ko\'rib chiqilmoqda...',
  'Statistika hisoblanmoqda...',
  'AI maslahatlar tayyorlanmoqda...',
  'Natijalar formatlashmoqda...',
];

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div style={{
    background: bg || '#fafafa',
    border: `1px solid ${color}22`,
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: '1 1 160px',
    minWidth: 0,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={20} color={color} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  </div>
);

export default function DashboardAdvisor({ user }) {
  const [period, setPeriod] = useState('weekly');
  const [advice, setAdvice] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Animate loading steps
  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchAdvice = async (p = period) => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    setAdvice('');
    setStats(null);
    try {
      const { data } = await axios.get(`${API_URL}/advisor/${userId}?period=${p}`);
      setAdvice(data.advice || '');
      setStats(data.stats || null);
      setHasAnalyzed(true);
    } catch (err) {
      setError(err.response?.data?.message || "Maslahatchi bilan bog'lanishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (hasAnalyzed) fetchAdvice(newPeriod);
  };

  const selectedPeriod = PERIODS.find(p => p.id === period);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #fdf3e3, #fde8c2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #f8d49a',
          }}>
            <Bot size={22} color="#c97a22" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>
              AI Biznes Maslahatchi
            </h1>
            <p style={{ fontSize: 13, color: '#888', margin: 0, marginTop: 1 }}>
              Savdolaringiz asosida shaxsiy tahlil va maslahatlar
            </p>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 20,
        background: '#f5f5f5', padding: '6px', borderRadius: 14,
        width: 'fit-content',
      }}>
        {PERIODS.map(p => {
          const Icon = p.icon;
          const isActive = period === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePeriodChange(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? '#c97a22' : '#888',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon size={15} />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Intro card — shown before first analysis */}
      {!hasAnalyzed && !isLoading && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbf5, #fff8ed)',
          border: '1px solid #fde8c2',
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          {/* Animated icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fdf3e3, #fde8c2)',
            border: '2px solid #f8d49a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(201,122,34,0.15)',
          }}>
            <Sparkles size={36} color="#c97a22" />
          </div>

          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 10 }}>
            {selectedPeriod?.desc} tahlilga tayyor
          </h3>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 28px' }}>
            Sizning mahsulotlaringiz, buyurtmalar va savdo statistikasini chuqur tahlil qilib,
            amaliy maslahatlar beramiz.
          </p>

          {/* What we analyze */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { icon: Package, text: 'Mahsulotlar' },
              { icon: ShoppingBag, text: 'Buyurtmalar' },
              { icon: Eye, text: "Ko'rishlar" },
              { icon: TrendingUp, text: 'Savdo trendi' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#fff', border: '1px solid #e5e5e5', borderRadius: 20,
                padding: '6px 14px', fontSize: 13, color: '#555', fontWeight: 500,
              }}>
                <Icon size={14} color="#c97a22" /> {text}
              </div>
            ))}
          </div>

          <button
            onClick={() => fetchAdvice()}
            style={{
              background: 'linear-gradient(135deg, #c97a22, #e8962a)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '13px 32px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 6px 20px rgba(201,122,34,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(201,122,34,0.35)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,122,34,0.3)'; }}
          >
            <Zap size={18} />
            Tahlilni boshlash
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          {/* Spinner */}
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
            <svg width="80" height="80" style={{ animation: 'advisorSpin 1.2s linear infinite', position: 'absolute' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0f0" strokeWidth="5" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#c97a22" strokeWidth="5"
                strokeDasharray="60 155" strokeLinecap="round" />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <Sparkles size={28} color="#c97a22" />
            </div>
          </div>

          <style>{`
            @keyframes advisorSpin { 100% { transform: rotate(360deg); } }
            @keyframes advisorFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}</style>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>
            AI Tahlil Qilmoqda...
          </h3>
          <p style={{
            fontSize: 13, color: '#c97a22', fontWeight: 600,
            animation: 'advisorFade 1.8s ease infinite',
            minHeight: 20,
          }}>
            {LOADING_STEPS[loadingStep]}
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: 20, width: '100%', maxWidth: 300, margin: '20px auto 0' }}>
            <div style={{ background: '#f5f5f5', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #c97a22, #e8962a)',
                animation: 'progressAnim 3s ease-in-out infinite',
              }} />
            </div>
            <style>{`
              @keyframes progressAnim {
                0% { width: 5%; }
                50% { width: 75%; }
                90% { width: 95%; }
                100% { width: 5%; }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderRadius: 12,
          background: '#fef2f2', border: '1px solid #fecaca',
          color: '#b91c1c', fontSize: 14, marginBottom: 20,
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Results */}
      {!isLoading && advice && (
        <>
          {/* KPI Stats */}
          {stats && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              <StatCard icon={ShoppingBag} label="Buyurtmalar" value={stats.totalOrders} color="#c97a22" />
              <StatCard icon={DollarSign} label="Daromad" value={`${stats.totalRevenue.toLocaleString()} so'm`} color="#16a34a" />
              <StatCard icon={Eye} label="Ko'rishlar" value={stats.totalViews} color="#2563eb" />
              <StatCard icon={TrendingUp} label="Sotilgan" value={`${stats.totalSold} ta`} color="#7c3aed" />
            </div>
          )}

          {/* Advice card */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderLeft: '4px solid #c97a22',
            borderRadius: 16,
            padding: '28px 32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 700, color: '#111', margin: 0 }}>
                <Sparkles size={22} color="#c97a22" />
                {selectedPeriod?.label} Tahlil Natijalari
              </h3>
              <button
                onClick={() => fetchAdvice()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: '#f5f5f5', border: 'none', cursor: 'pointer',
                  color: '#666', transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#e5e5e5'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#f5f5f5'; }}
              >
                <RefreshCw size={13} /> Yangilash
              </button>
            </div>
            <div style={{ color: '#333', lineHeight: 1.75, fontSize: 14 }} className="advisor-markdown">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          </div>

          {/* Period switcher after results */}
          <div style={{
            background: '#f9f9f9',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Boshqa davr ko'rish:</span>
            {PERIODS.filter(p => p.id !== period).map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                    background: '#fff', border: '1.5px solid #e5e5e5',
                    cursor: 'pointer', color: '#555', transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#c97a22'; e.currentTarget.style.color = '#c97a22'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}
                >
                  <Icon size={13} /> {p.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .advisor-markdown h1, .advisor-markdown h2, .advisor-markdown h3 {
          color: #111; margin-top: 20px; margin-bottom: 10px; font-weight: 700;
        }
        .advisor-markdown h3 { font-size: 15px; }
        .advisor-markdown p { margin-bottom: 12px; }
        .advisor-markdown ul, .advisor-markdown ol { padding-left: 22px; margin-bottom: 12px; }
        .advisor-markdown li { margin-bottom: 6px; }
        .advisor-markdown strong { color: #111; font-weight: 700; }
        .advisor-markdown hr { border: none; border-top: 1px solid #f0f0f0; margin: 20px 0; }
        .advisor-markdown code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
      `}</style>
    </div>
  );
}
