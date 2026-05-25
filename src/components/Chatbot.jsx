import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User, Gift, Sparkles, Gem, Truck } from 'lucide-react';
import { API_URL } from '../data/constants';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';

const QUICK_REPLIES_DATA = [
  {
    icon: Gift,
    iconColor: '#c97a22',
    iconBg: '#fff7ed',
    text: {
      uz: "Sovg'a qidiryapman",
      ru: "Ищу подарок",
      en: "Looking for a gift"
    }
  },
  {
    icon: Sparkles,
    iconColor: '#2563eb',
    iconBg: '#eff6ff',
    text: {
      uz: "Keramika mahsulotlari",
      ru: "Керамические изделия",
      en: "Ceramic products"
    }
  },
  {
    icon: Gem,
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff',
    text: {
      uz: "Zargarlik buyumlari",
      ru: "Ювелирные изделия",
      en: "Jewelry"
    }
  },
  {
    icon: Truck,
    iconColor: '#059669',
    iconBg: '#ecfdf5',
    text: {
      uz: "Yetkazib berish qanday?",
      ru: "Как работает доставка?",
      en: "How does delivery work?"
    }
  }
];

const GREETINGS = {
  uz: "Assalomu alaykum! Men E-Hunarmand savdo yordamchisiman. Qanday milliy hunarmandchilik mahsulotini qidirmoqdasiz?",
  ru: "Здравствуйте! Я торговый помощник E-Hunarmand. Какое национальное ремесленное изделие вы ищете?",
  en: "Hello! I am the E-Hunarmand sales assistant. What kind of national craft product are you looking for?"
};

const USER_GREETINGS = {
  uz: (name) => `Assalomu alaykum, **${name}**! 🎉 E-Hunarmand do'koniga xush kelibsiz! Bugun nimalar xarid qilishni reja qilyapsiz? Maslahat kerak bo'lsa, bemalol so'rang! 👇`,
  ru: (name) => `Здравствуйте, **${name}**! 🎉 Добро пожаловать в магазин E-Hunarmand! Что планируете купить сегодня? Если нужен совет, смело спрашивайте! 👇`,
  en: (name) => `Hello, **${name}**! 🎉 Welcome to the E-Hunarmand store! What are you planning to buy today? If you need advice, feel free to ask! 👇`
};

// Robust markdown parser for images, links, bold, and newlines
const parseMarkdown = (text, onLinkClick) => {
  const regex = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|\n)/g;
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (!part) return null;
    
    // Check if image
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <div key={i} style={{ marginTop: 8, marginBottom: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
          <img src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: 160 }} />
          {imgMatch[1] && <div style={{ padding: '4px 8px', fontSize: 11, color: '#666', borderTop: '1px solid #eee', background: '#fafafa', textAlign: 'center', fontWeight: 500 }}>{imgMatch[1]}</div>}
        </div>
      );
    }
    
    // Check if link — close chatbot on click
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <Link
          key={i}
          to={linkMatch[2]}
          style={{ color: '#c97a22', textDecoration: 'underline', fontWeight: 600 }}
          onClick={() => onLinkClick && onLinkClick()}
        >
          {linkMatch[1]}
        </Link>
      );
    }
    
    // Check if bold
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }

    // Check if newline
    if (part === '\n') {
      return <br key={i} />;
    }
    
    // Regular text
    return <span key={i}>{part}</span>;
  });
};

export default function Chatbot() {
  const { user } = useAuthStore();
  const productsLoaded = useUIStore((s) => s.productsLoaded);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language || 'uz';

  const [hasGreetedUser, setHasGreetedUser] = useState(false);

  // Initialize greeting message when language changes or initially
  useEffect(() => {
    const defaultGreeting = GREETINGS[currentLang] || GREETINGS.uz;
    
    if (messages.length === 0 && !user) {
      setMessages([{ role: 'ai', text: defaultGreeting }]);
    } else if (messages.length === 1 && !user && messages[0].role === 'ai') {
      setMessages([{ role: 'ai', text: defaultGreeting }]);
    }
  }, [messages.length, user, currentLang]);

  // Auto-open logic: wait for products to load first, then open after 3 seconds (only if tour is completed)
  useEffect(() => {
    const isTourDone = localStorage.getItem('tour-v2-done') === 'true';
    if (!isTourDone) return;

    if (sessionStorage.getItem('chatbot_auto_opened')) return;

    if (productsLoaded) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('chatbot_auto_opened', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }

    const fallbackTimer = setTimeout(() => {
      if (!sessionStorage.getItem('chatbot_auto_opened')) {
        setIsOpen(true);
        sessionStorage.setItem('chatbot_auto_opened', 'true');
      }
    }, 8000);
    return () => clearTimeout(fallbackTimer);
  }, [productsLoaded]);

  // Special greeting when a user logs in (only if tour is completed)
  useEffect(() => {
    const isTourDone = localStorage.getItem('tour-v2-done') === 'true';
    if (!isTourDone) return;

    if (user && !hasGreetedUser) {
      setHasGreetedUser(true);
      const userName = user.name ? user.name.split(' ')[0] : '';
      const personalizedGreeting = (USER_GREETINGS[currentLang] || USER_GREETINGS.uz)(userName);
      setMessages([{ role: 'ai', text: personalizedGreeting }]);
      setTimeout(() => { setIsOpen(true); }, 1000);
    }
  }, [user, hasGreetedUser, currentLang]);

  // Listen to the custom onboarding finish event to trigger chatbot
  useEffect(() => {
    const handleTourFinished = () => {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('chatbot_auto_opened', 'true');
      }, 800);
      return () => clearTimeout(timer);
    };

    window.addEventListener('onboarding-tour-finished', handleTourFinished);
    return () => window.removeEventListener('onboarding-tour-finished', handleTourFinished);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Don't show chatbot in dashboard/admin
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) return null;

  const handleSend = async (e, forcedText = null) => {
    e?.preventDefault();
    const textToSend = forcedText !== null ? forcedText : input;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot`, {
        messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
        language: currentLang
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.text }]);
    } catch (error) {
      const errorMsg = currentLang === 'ru' ? "Извините, произошла ошибка. Пожалуйста, попробуйте позже." : 
                       currentLang === 'en' ? "Sorry, an error occurred. Please try again later." :
                       "Uzur, xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.";
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasBottomNav = !!user;

  return (
    <>
      <style>{`
        /* ── Chatbot Floating Button ── */
        .cb-btn {
          position: fixed;
          bottom: 24px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #c97a22;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(201, 122, 34, 0.22);
          border: none;
          cursor: pointer;
          z-index: 600;
          transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
        }
        .cb-btn:hover {
          transform: scale(1.04);
          background: #b45309;
          box-shadow: 0 6px 18px rgba(201, 122, 34, 0.32);
        }
        .cb-btn.has-nav {
          bottom: 80px;
        }

        /* ── Chatbot Window — Desktop ── */
        .cb-window {
          position: fixed;
          bottom: 88px;
          right: 20px;
          width: 330px;
          height: 490px;
          max-height: calc(100vh - 88px - 80px);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          z-index: 600;
          overflow: hidden;
          border: 1px solid #e4e4e7;
          animation: cbSlideUp 0.25s cubic-bezier(.4,0,.2,1);
        }
        .cb-window.has-nav {
          bottom: 100px;
          max-height: calc(100vh - 100px - 80px);
        }

        @keyframes cbSlideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Mobile ── */
        @media (max-width: 540px) {
          .cb-btn {
            bottom: 20px;
            right: 16px;
            width: 48px;
            height: 48px;
          }
          .cb-btn.has-nav {
            bottom: 80px;
          }
          .cb-window {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: 16px;
            height: 520px;
            max-height: calc(100dvh - 16px - 80px);
            max-height: calc(100vh - 16px - 80px);
          }
          .cb-window.has-nav {
            bottom: 80px;
            height: 460px;
            max-height: calc(100dvh - 80px - 80px);
            max-height: calc(100vh - 80px - 80px);
          }
        }

        /* Scrollbars */
        .cb-messages::-webkit-scrollbar { width: 4px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }

        .cb-quick::-webkit-scrollbar { display: none; }
        
        .cb-input:focus {
          border-color: #c97a22 !important;
          background-color: #fff !important;
          outline: none;
        }
      `}</style>

      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          id="tour-chatbot-btn"
          className={`cb-btn${hasBottomNav ? ' has-nav' : ''}`}
          onClick={() => setIsOpen(true)}
          aria-label="Chatbot ochish"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className={`cb-window${hasBottomNav ? ' has-nav' : ''}`}>
          
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: '#ffffff',
            borderBottom: '1px solid #f4f4f5',
            color: '#18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#fff7ed',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c97a22',
                border: '1px solid #ffedd5',
              }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#18181b', lineHeight: 1.25 }}>E-Hunarmand AI</div>
                <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1.5px' }}>Savdo yordamchisi</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages pattern-bg-chatbot" style={{
            flex: 1,
            padding: '14px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#fafafa',
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                gap: '6px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: msg.role === 'user' ? '#f4f4f5' : '#fff7ed',
                  color: msg.role === 'user' ? '#71717a' : '#c97a22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: msg.role === 'user' ? '1px solid #e4e4e7' : '1px solid #ffedd5',
                }}>
                  {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                </div>
                {/* Bubble */}
                <div style={{
                  padding: '10px 13px',
                  borderRadius: '12px',
                  borderTopLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                  borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                  background: msg.role === 'user' ? '#c97a22' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#27272a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  border: msg.role === 'user' ? 'none' : '1px solid #e4e4e7',
                }}>
                  {msg.role === 'user' ? msg.text : parseMarkdown(msg.text, () => setIsOpen(false))}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: '#fff7ed', color: '#c97a22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #ffedd5',
                }}>
                  <Bot size={12}/>
                </div>
                <div style={{
                  padding: '10px 14px', borderRadius: '12px', borderTopLeftRadius: '2px',
                  background: '#fff', border: '1px solid #e4e4e7',
                  display: 'flex', gap: 4, alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#c97a22', opacity: 0.7,
                      animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                  <style>{`
                    @keyframes dotBounce {
                      0%, 80%, 100% { transform: translateY(0); }
                      40% { transform: translateY(-5px); }
                    }
                  `}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isLoading && (
            <div className="cb-quick" style={{
              padding: '8px 12px',
              background: '#fff',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              borderTop: '1px solid #f4f4f5',
              scrollbarWidth: 'none',
            }}>
              {QUICK_REPLIES_DATA.map((reply, i) => {
                const IconComp = reply.icon;
                const labelText = reply.text[currentLang] || reply.text.uz;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(null, labelText)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #e4e4e7',
                      background: '#ffffff',
                      color: '#27272a',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = '#f4f4f5';
                      e.currentTarget.style.color = '#18181b';
                      e.currentTarget.style.borderColor = '#d4d4d8';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#27272a';
                      e.currentTarget.style.borderColor = '#e4e4e7';
                    }}
                  >
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: reply.iconColor,
                      background: reply.iconBg,
                      padding: '3px',
                      borderRadius: '4px',
                      marginRight: '2px',
                    }}>
                      <IconComp size={12} />
                    </span>
                    {labelText}
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '10px 12px',
            background: '#fff',
            borderTop: '1px solid #f4f4f5',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              className="cb-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Xabar yozing..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '20px',
                border: '1px solid #e4e4e7',
                fontSize: '13px',
                background: '#f4f4f5',
                transition: 'border 0.2s, background-color 0.2s',
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                flexShrink: 0,
                background: input.trim() && !isLoading
                  ? '#c97a22'
                  : '#f4f4f5',
                color: input.trim() && !isLoading ? '#fff' : '#a1a1aa',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Send size={15} style={{ marginLeft: '1px' }}/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
