import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const MOCK_MESSAGES = [];

export default function DashboardMessages({ messages, selectedMsg, selectMessageThread, handleSendReply }) {
  const [reply, setReply] = useState('');
  const [active, setActive] = useState(null);
  const [localThread, setLocalThread] = useState(null);

  const allMessages = messages?.length ? messages : MOCK_MESSAGES;
  const unreadCount = allMessages.filter(m => m.unread).length;

  const handleSelect = (msg) => {
    setActive(msg.id);
    setLocalThread(msg.thread || []);
    if (selectMessageThread) selectMessageThread(msg);
  };

  const handleSend = () => {
    if (!reply.trim()) return;
    const text = reply.trim();
    const newMsg = { from: false, text, time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) };
    setLocalThread(prev => [...(prev || []), newMsg]);
    setReply('');
    
    if (handleSendReply) {
      const currentThread = allMessages.find(m => m.id === active);
      if (currentThread) {
        handleSendReply(text, currentThread);
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

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14, height: 'calc(100vh - 190px)' }}>
        {/* Message List */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {allMessages.map(m => (
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
                background: m.initBg || '#f5f4f2',
                color: m.initColor || '#888',
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
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {active && localThread ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {allMessages.find(m => m.id === active)?.initial}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: '#111' }}>{allMessages.find(m => m.id === active)?.user}</p>
                  <p style={{ margin: 0, fontSize: 11.5, color: '#aaa' }}>Online</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {localThread.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.from ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: msg.from ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                      background: msg.from ? '#f5f4f2' : '#c97a22',
                      color: msg.from ? '#111' : '#fff',
                      fontSize: 13.5, lineHeight: 1.55
                    }}>
                      {msg.text}
                    </div>
                    <p style={{ fontSize: 11, color: '#bbb', margin: '3px 4px 0', textAlign: msg.from ? 'left' : 'right' }}>{msg.time}</p>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                <input
                  className="chat-input"
                  placeholder="Xabar yozing..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!reply.trim()}
                  className="chat-send-btn"
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
