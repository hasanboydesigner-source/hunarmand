import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { API_URL, CATEGORIES } from '../data/constants';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';

// Robust markdown parser for images, links, bold, and newlines
const parseMarkdown = (text) => {
  const regex = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|\n)/g;
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (!part) return null;
    
    // Check if image
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <div key={i} style={{ marginTop: 10, marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
          <img src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: 200 }} />
          {imgMatch[1] && <div style={{ padding: '6px 10px', fontSize: 12, color: '#666', borderTop: '1px solid #eee', background: '#fafafa', textAlign: 'center', fontWeight: 500 }}>{imgMatch[1]}</div>}
        </div>
      );
    }
    
    // Check if link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <Link key={i} to={linkMatch[2]} style={{ color: '#c97a22', textDecoration: 'underline', fontWeight: 600 }}>{linkMatch[1]}</Link>;
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Initialize and Auto-open logic
  useEffect(() => {
    // Determine greeting
    const userName = user?.name ? user.name.split(' ')[0] : '';
    const cats = CATEGORIES.map(c => c.name).join(', ');
    const greeting = userName 
      ? `Assalomu alaykum, **${userName}**! E-Hunarmand do'koniga xush kelibsiz! 🎉 Sizga asosan qanday yo'nalishdagi mahsulotlar qiziq? Bizda ${cats} bo'yicha noyob buyumlar bor.`
      : `Assalomu alaykum! Men E-Hunarmand maxsus savdo yordamchisiman. Sizga qanday milliy hunarmandchilik mahsulotlarini tanlashda yordam bera olaman? Bizda quyidagi yo'nalishlar bor: ${cats}.`;
    
    if (messages.length === 0) {
      setMessages([{ role: 'ai', text: greeting }]);
    }

    // Auto-open logic (wait 3 seconds, once per session, for everyone)
    if (!sessionStorage.getItem('chatbot_auto_opened')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('chatbot_auto_opened', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Don't show chatbot in dashboard
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot`, {
        messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text }))
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Uzur, xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '30px', right: '30px',
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #c97a22, #b45309)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(201,122,34,0.5)',
            border: 'none', cursor: 'pointer', zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '360px', height: '600px', maxHeight: '85vh',
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', 
            background: 'linear-gradient(135deg, #c97a22, #b45309)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(201,122,34,0.3)',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: '#fff', color: '#c97a22', 
                padding: '8px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>E-Hunarmand AI</h3>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>Savdo bo'yicha yordamchi</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', 
                cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9fafb' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                display: 'flex', gap: '8px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? '#e5e7eb' : '#fff8f0',
                  color: msg.role === 'user' ? '#6b7280' : '#c97a22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  borderTopLeftRadius: msg.role === 'ai' ? '4px' : '14px',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '14px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #c97a22, #b45309)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#222',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  fontSize: '14px', lineHeight: '1.6',
                  wordBreak: 'break-word',
                  border: msg.role === 'user' ? 'none' : '1px solid #eaeaea'
                }}>
                  {msg.role === 'user' ? msg.text : parseMarkdown(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff8f0', color: '#c97a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16}/></div>
                <div style={{ padding: '12px 16px', borderRadius: '14px', borderTopLeftRadius: '4px', background: '#fff', color: '#888', fontSize: '13px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' }}>
                  Yozmoqda...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '15px 20px', background: '#fff', borderTop: '1px solid #eee',
            display: 'flex', gap: '10px', alignItems: 'center'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Xabar yozing..."
              style={{
                flex: 1, padding: '12px 18px', borderRadius: '24px',
                border: '1px solid #e5e7eb', outline: 'none', fontSize: '14px',
                background: '#f9fafb', transition: 'border 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#c97a22'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: input.trim() && !isLoading ? 'linear-gradient(135deg, #c97a22, #b45309)' : '#f3f4f6',
                color: input.trim() && !isLoading ? '#fff' : '#9ca3af',
                border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: input.trim() && !isLoading ? '0 4px 10px rgba(201,122,34,0.3)' : 'none'
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }}/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
