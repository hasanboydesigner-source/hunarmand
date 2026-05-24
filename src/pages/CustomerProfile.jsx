import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ORDER_STATUSES } from '../data/constants';
import { toast } from 'react-toastify';
import { User, Package, Settings, LogOut, Clock, Check, Truck, XCircle } from 'lucide-react';
import { BounceLoader } from 'react-spinners';
import './CustomerProfile.css';

// Simple client-side cache to enable instant tab switching without full unmount reloading
let cachedProfile = null;
let cachedOrders = null;
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
  const [isLoading, setIsLoading] = useState(!cachedProfile);
  const [isSaving, setIsSaving] = useState(false);

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
        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/auth/users/${user?.id}`),
          axios.get(`${API_URL}/orders/customer/${user?.id}`)
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
        
        cachedProfile = newProfile;
        cachedOrders = ordersRes.data;
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

  const handleLogout = () => {
    logout();
    cachedProfile = null;
    cachedOrders = null;
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
          </main>
        </div>
      </div>
    </div>
  );
}
