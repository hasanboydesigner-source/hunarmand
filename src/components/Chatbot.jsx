import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { API_URL } from '../data/constants';
import { useLocation, Link } from 'react-router-dom';

// Simple markdown link parser to render links
const parseMarkdownLinks = (text) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      return <Link key={i} to={match[2]} style={{ color: '#c97a22', textDecoration: 'underline', fontWeight: 600 }}>{match[1]}</Link>;
    }
    // simple bold parser
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={j}>{bp.slice(2, -2)}</strong>;
          }
          // simple newline parser
          const nlParts = bp.split('\n');
          return nlParts.map((nlp, k) => (
            <span key={k}>
              {nlp}
              {k !== nlParts.length - 1 && <br />}
            </span>
          ));
        })}
      </span>
    );
  });
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalomu alaykum! Men E-Hunarmand do'konining maxsus savdo yordamchisiman. Sizga qanday milliy hunarmandchilik mahsulotlarini tanlashda yordam bera olaman? 😊" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Don't show chatbot in dashboard
  if (location.pathname.startsWith('/dashboard')) return null;

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
            background: '#c97a22', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(201,122,34,0.4)',
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
          width: '360px', height: '550px',
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
          border: '1px solid #eee'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', background: 'linear-gradient(135deg, #c97a22, #eab308)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>E-Hunarmand AI</h3>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Savdo bo'yicha yordamchi</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9fafb' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex', gap: '8px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? '#e5e7eb' : '#fff8f0',
                  color: msg.role === 'user' ? '#6b7280' : '#c97a22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                </div>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderTopLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                  borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                  background: msg.role === 'user' ? '#c97a22' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '14px', lineHeight: '1.5',
                  wordBreak: 'break-word'
                }}>
                  {msg.role === 'user' ? msg.text : parseMarkdownLinks(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff8f0', color: '#c97a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16}/></div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', borderTopLeftRadius: '2px', background: '#fff', color: '#888', fontSize: '13px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  Yozmoqda...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '15px', background: '#fff', borderTop: '1px solid #eee',
            display: 'flex', gap: '10px'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Xabar yozing..."
              style={{
                flex: 1, padding: '10px 15px', borderRadius: '20px',
                border: '1px solid #ddd', outline: 'none', fontSize: '14px'
              }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: input.trim() && !isLoading ? '#c97a22' : '#f3f4f6',
                color: input.trim() && !isLoading ? '#fff' : '#9ca3af',
                border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
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
