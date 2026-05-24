import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ORDER_STATUSES } from '../data/constants';
import { toast } from 'react-toastify';
import { User, Package, Settings, LogOut, Clock, Check, Truck, XCircle, MessageSquare, Send } from 'lucide-react';
import { BounceLoader } from 'react-spinners';
import './CustomerProfile.css';

// Simple client-side cache to enable instant tab switching without full unmount reloading
let cachedProfile = null;
let cachedOrders = null;
let cachedMessages = null;
let cachedUserId = null;

export default function CustomerProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.includes('orders') ? 'orders' : 'profile');
  
  const [profile, setProfile] = useState(cachedProfile || {
    name: '', email: '', phone: '', region: ''
  });
  const [orders, setOrders] = useState(cachedOrders || []);
  const [messages, setMessages] = useState(cachedMessages || []);
  const [isLoading, setIsLoading] = useState(!cachedProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (cachedUserId !== user?.id) {
      cachedProfile = null;
      cachedOrders = null;
      cachedUserId = user?.id;
    }
    
    // Fetch profile and orders
    const fetchData = async () => {
      if (!cachedProfile) {
        setIsLoading(true);
      }
      try {
        const [profileRes, ordersRes, msgRes] = await Promise.all([
          axios.get(`${API_URL}/auth/users/${user?.id}`),
          axios.get(`${API_URL}/orders/customer/${user?.id}`),
          axios.get(`${API_URL}/messages/customer/${user?.id}`).catch(() => ({ data: [] }))
        ]);
        
        const p = profileRes.data;
        const newProfile = {
          name: p.name || '',
          email: p.email || '',
          phone: p.phone || '',
          region: p.region || ''
        };
        
        setProfile(newProfile);
        setOrders(ordersRes.data);
        setMessages(msgRes.data || []);
        
        cachedProfile = newProfile;
        cachedOrders = ordersRes.data;
        cachedMessages = msgRes.data || [];
      } catch (error) {
        console.error("Failed to fetch customer data", error);
        toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAuthenticated, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, {
        userId: user.id,
        ...profile
      });
      updateUser({ name: profile.name, email: profile.email });
      cachedProfile = { ...cachedProfile, ...profile };
      toast.success("Profil muvaffaqiyatli yangilandi!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendCustomerReply = async (craftsmanId) => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`${API_URL}/messages`, {
        sender: user.name,
        senderId: user.id || user._id,
        receiverId: craftsmanId,
        text: replyText,
        avatar: user.avatar || ''
      });
      const newMsg = {
        _rawTime: new Date().toISOString(),
        senderId: user.id,
        receiverId: craftsmanId,
        text: replyText,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      cachedMessages = [...messages, newMsg];
      setReplyText('');
    } catch (err) {
      toast.error("Xabar yuborishda xatolik yuz berdi");
    }
  };

  const handleLogout = () => {
    logout();
    cachedProfile = null;
    cachedOrders = null;
    cachedMessages = null;
    cachedUserId = null;
    toast.info("Tizimdan muvaffaqiyatli chiqdingiz! 👋");
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="page-with-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <BounceLoader color="#d4822a" size={45} />
        <span style={{ fontFamily: 'Italiana, serif', fontSize: '18px', color: 'var(--text-primary)' }}>Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="cp-page page-with-header">
      <div className="container">
        <div className="cp-header">
          <h1>Shaxsiy Kabinet</h1>
          <p>Xush kelibsiz, {user?.name}!</p>
        </div>

        <div className="cp-layout">
          {/* Sidebar */}
          <aside className="cp-sidebar">
            <button 
              className={`cp-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); navigate('/profile'); }}
            >
              <User size={18} /> Profil Sozlamalari
            </button>
            <button 
              className={`cp-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); navigate('/profile/orders'); }}
            >
              <Package size={18} /> Mening Buyurtmalarim
            </button>
            <button 
              className={`cp-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => { setActiveTab('messages'); navigate('/profile/messages'); }}
            >
              <MessageSquare size={18} /> Xabarlarim
            </button>
            <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
            <button className="cp-nav-btn" style={{ color: '#dc2626' }} onClick={handleLogout}>
              <LogOut size={18} /> Tizimdan chiqish
            </button>
          </aside>

          {/* Content */}
          <main className="cp-content">
            <div className={`cp-tab-pane ${activeTab === 'profile' ? 'active' : ''}`}>
                <h2>Profil Sozlamalari</h2>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                  <div className="form-group">
                    <label className="form-label">To'liq ismingiz</label>
                    <input 
                      className="form-input" 
                      value={profile.name} 
                      onChange={e => setProfile({...profile, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email manzil</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={profile.email} 
                      onChange={e => setProfile({...profile, email: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefon raqam</label>
                    <input 
                      className="form-input" 
                      value={profile.phone} 
                      onChange={e => setProfile({...profile, phone: e.target.value})} 
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Viloyat / Shahar</label>
                    <input 
                      className="form-input" 
                      value={profile.region} 
                      onChange={e => setProfile({...profile, region: e.target.value})} 
                      placeholder="Masalan: Toshkent shahri"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
                    {isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                  </button>
                </form>
            </div>

            <div className={`cp-tab-pane ${activeTab === 'orders' ? 'active' : ''}`}>
              <h2>Mening Buyurtmalarim</h2>
                {orders.length === 0 ? (
                  <div className="cp-empty">
                    <Package size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p>Sizda hali buyurtmalar yo'q.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="cp-order-card">
                      <div className="cp-order-header">
                        <div>
                          <div className="cp-order-id">{order.orderNumber}</div>
                          <div className="cp-order-date">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</div>
                        </div>
                        <div>
                          {order.status === 'pending' && <span className="status-badge warning"><Clock size={14}/> Kutilmoqda</span>}
                          {order.status === 'processing' && <span className="status-badge info"><Settings size={14}/> Jarayonda</span>}
                          {order.status === 'shipped' && <span className="status-badge info"><Truck size={14}/> Yuborildi</span>}
                          {order.status === 'delivered' && <span className="status-badge success"><Check size={14}/> Yetkazildi</span>}
                          {order.status === 'cancelled' && <span className="status-badge error"><XCircle size={14}/> Bekor qilingan</span>}
                        </div>
                      </div>
                      
                      <div className="cp-order-body">
                        <div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.5px' }}>MAHSULOTLAR</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {item.image && <img src={item.image} alt="" className="cp-order-item-img" />}
                              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                {item.title} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>x{item.quantity}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>UMUMIY SUMMA</p>
                          <div className="cp-order-amount">{order.totalAmount?.toLocaleString()} so'm</div>
                          <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>
                            To'lov turi: <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </div>

            <div className={`cp-tab-pane ${activeTab === 'messages' ? 'active' : ''}`}>
              <h2>Xabarlarim</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14, minHeight: '500px' }}>
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {(() => {
                    const threads = {};
                    messages.forEach(m => {
                      const isFromMe = m.senderId === user?.id || m.sender === user?.name;
                      const otherId = isFromMe ? m.receiverId : m.senderId;
                      const otherName = isFromMe ? (m.receiverName || 'Hunarmand') : m.sender;
                      if (!otherId) return;

                      if (!threads[otherId]) {
                        threads[otherId] = {
                          id: otherId, name: otherName,
                          initial: otherName ? otherName[0].toUpperCase() : 'H',
                          preview: m.text,
                          latestTime: m.createdAt || new Date().toISOString(),
                          thread: []
                        };
                      }
                      if (new Date(m.createdAt || 0) > new Date(threads[otherId].latestTime)) {
                        threads[otherId].preview = m.text;
                        threads[otherId].latestTime = m.createdAt || new Date().toISOString();
                      }
                      threads[otherId].thread.push({
                        from: !isFromMe, text: m.text, _rawTime: m.createdAt || new Date().toISOString(),
                        time: new Date(m.createdAt || Date.now()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
                      });
                    });
                    
                    const threadList = Object.values(threads).sort((a,b) => new Date(b.latestTime) - new Date(a.latestTime));
                    
                    if (threadList.length === 0) {
                      return <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Xabarlar yo'q</div>;
                    }

                    return threadList.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          t.thread.sort((a,b) => new Date(a._rawTime) - new Date(b._rawTime));
                          setActiveChat(t);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '13px 14px', borderBottom: '1px solid #f5f5f5',
                          background: activeChat?.id === t.id ? '#fff8f0' : 'transparent',
                          textAlign: 'left', width: '100%', border: 'none',
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f4f2', color: '#c97a22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          {t.initial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{t.name}</span>
                          </div>
                          <p style={{ fontSize: 12.5, color: '#888', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.preview}
                          </p>
                        </div>
                      </button>
                    ));
                  })()}
                </div>

                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {activeChat ? (
                    <>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                          {activeChat.initial}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: '#111' }}>{activeChat.name}</p>
                          <p style={{ margin: 0, fontSize: 11.5, color: '#aaa' }}>Hunarmand</p>
                        </div>
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {activeChat.thread.map((msg, i) => (
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

                      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                        <input
                          className="chat-input"
                          placeholder="Xabar yozing..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendCustomerReply(activeChat.id)}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #ebebeb', outline: 'none' }}
                        />
                        <button
                          onClick={() => handleSendCustomerReply(activeChat.id)}
                          disabled={!replyText.trim()}
                          style={{ background: '#c97a22', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: replyText.trim() ? 'pointer' : 'not-allowed', opacity: replyText.trim() ? 1 : 0.6 }}
                        >
                          <Send size={16}/>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#ccc' }}>
                      <MessageSquare size={44} strokeWidth={1.5}/>
                      <p style={{ fontSize: 14, margin: 0 }}>Suhbatni tanlang</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
