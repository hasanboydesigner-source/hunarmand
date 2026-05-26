import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, ChevronLeft } from 'lucide-react';

export default function DashboardMessages({ messages = [], selectMessageThread, handleSendReply }) {
  const [reply, setReply] = useState('');
  const [active, setActive] = useState(null);
  const [localThread, setLocalThread] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const unreadCount = messages.filter(m => m.unread).length;

  // Active thread object
  const activeThread = messages.find(m => m.id === active);

  const [threadLength, setThreadLength] = useState(0);

  // Auto-scroll to bottom only when new message arrives or thread changes
  useEffect(() => {
    if (localThread && localThread.length !== threadLength) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      setThreadLength(localThread.length);
    }
  }, [localThread, threadLength]);

  // Sync localThread when messages prop updates (e.g. after send reply or polling)
  useEffect(() => {
    if (active) {
      const updated = messages.find(m => m.id === active);
      if (updated) {
        setLocalThread(updated.thread || []);
      }
    }
  }, [messages, active]);

  const handleSelect = (msg) => {
    setActive(msg.id);
    setLocalThread(msg.thread || []);
    setThreadLength(0); // Force scroll for new thread
    if (selectMessageThread) selectMessageThread(msg);
  };

  const handleSend = async () => {
    const text = reply.trim();
    if (!text || isSending) return;

    // Optimistic UI: darhol chat oynasida ko'rsat
    const optimisticMsg = {
      from: false,
      text,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      _rawTime: new Date().toISOString()
    };
    setLocalThread(prev => [...(prev || []), optimisticMsg]);
    setReply('');

    if (handleSendReply && activeThread) {
      setIsSending(true);
      try {
        await handleSendReply(text, activeThread);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Xabarlar</h1>
        {unreadCount > 0 && (
          <span style={{ fontSize: 13, color: '#888' }}>
            <span style={{ color: '#c97a22', fontWeight: 600 }}>{unreadCount} ta</span> o'qilmagan
          </span>
        )}
      </div>

      <div className={`messages-layout ${active ? 'chat-active' : ''}`}>
        {/* Message List */}
        <div className="messages-list">
          {messages.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: '#bbb' }}>
              <MessageCircle size={32} strokeWidth={1.5} style={{ marginBottom: 8 }}/>
              <p style={{ fontSize: 13, margin: 0 }}>Xabarlar yo'q</p>
            </div>
          ) : messages.map(m => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 14px', borderBottom: '1px solid #f5f5f5',
                background: active === m.id ? '#fff8f0' : 'transparent',
                textAlign: 'left', width: '100%', border: 'none',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: active === m.id ? '#fff0dc' : (m.initBg || '#f5f4f2'),
                color: m.initColor || '#c97a22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, flexShrink: 0
              }}>
                {m.initial || m.user?.[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{m.user}</span>
                  <span style={{ fontSize: 11, color: '#bbb' }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 12.5, color: '#888', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.preview}
                </p>
              </div>
              {m.unread && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c97a22', flexShrink: 0 }}/>
              )}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="message-chat">
          {active && localThread ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <button 
                  className="dash-menu-toggle" 
                  onClick={() => setActive(null)} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4, width: 32, height: 32 }}
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#fff0dc', color: '#c97a22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {activeThread?.initial}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: '#111' }}>{activeThread?.user}</p>
                  <p style={{ margin: 0, fontSize: 11.5, color: '#aaa' }}>Mijoz</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {localThread.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.from ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.from ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                      background: msg.from ? '#f5f4f2' : '#c97a22',
                      color: msg.from ? '#111' : '#fff',
                      fontSize: 13.5, lineHeight: 1.55
                    }}>
                      {msg.text}
                    </div>
                    <p style={{ fontSize: 11, color: '#bbb', margin: '3px 4px 0', textAlign: msg.from ? 'left' : 'right' }}>{msg.time}</p>
                  </div>
                ))}
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                <input
                  className="chat-input"
                  placeholder="Xabar yozing..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isSending}
                  style={{ flex: 1, opacity: isSending ? 0.7 : 1 }}
                />
                <button
                  onClick={handleSend}
                  disabled={!reply.trim() || isSending}
                  className="chat-send-btn"
                  style={{ opacity: (!reply.trim() || isSending) ? 0.5 : 1 }}
                >
                  <Send size={16}/>
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#ccc' }}>
              <MessageCircle size={44} strokeWidth={1.5}/>
              <p style={{ fontSize: 14, margin: 0 }}>Suhbatni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
