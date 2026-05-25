import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, XCircle, Menu, X, Upload, Clock, RefreshCw, Truck, Check, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CATEGORIES, API_URL } from '../data/constants';
import './Dashboard.css';

import { useDashboardData } from '../hooks/useDashboardData';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardProducts from '../components/dashboard/DashboardProducts';
import DashboardOrders from '../components/dashboard/DashboardOrders';
import DashboardReviews from '../components/dashboard/DashboardReviews';
import DashboardMessages from '../components/dashboard/DashboardMessages';
import DashboardSettings from '../components/dashboard/DashboardSettings';
import DashboardAdvisor from '../components/dashboard/DashboardAdvisor';

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'overview';
  const [active, setActive] = useState(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toasts via react-toastify
  const addToast = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  const dashData = useDashboardData(user, addToast, updateUser);

  // Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ 
    title: '', price: '', inStock: '', category: 'Keramika', image: '', images: [],
    sku: '', material: '', preparationTime: '', description: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ 
      title: '', price: '', inStock: '', category: 'Keramika', image: '', images: [],
      sku: '', material: '', preparationTime: '', description: ''
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title || '', price: String(prod.price || ''),
      inStock: String(prod.inStock || ''), category: prod.category || 'Keramika',
      image: prod.image || '', images: prod.images || (prod.image ? [prod.image] : []),
      sku: prod.sku || '', material: prod.material || '', 
      preparationTime: prod.preparationTime || '', description: prod.description || ''
    });
    setShowProductModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(data.url);
      }
      setProductForm(prev => {
        const newImages = [...(prev.images || []), ...uploadedUrls];
        return { ...prev, images: newImages, image: newImages[0] || prev.image };
      });
      addToast('Rasmlar muvaffaqiyatli yuklandi!', 'success');
    } catch {
      addToast("Rasm yuklashda xatolik yuz berdi", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const submitProductForm = async (e) => {
    e.preventDefault();
    const success = await dashData.handleSaveProduct(editingProduct, productForm);
    if (success) setShowProductModal(false);
  };

  // Order Detail Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const openOrderDetails = (order) => { setSelectedOrder(order); setShowOrderModal(true); };

  const [selectedMsg, setSelectedMsg] = useState(null);

  // Counts
  const unreadOrdersCount = dashData.orders?.filter(o => o.status === 'pending').length || 0;
  const unreadMessagesCount = dashData.messages?.filter(m => m.unread || !m.isRead).length || 0;
  const reviewsCount = dashData.reviews?.length || 0;

  // Mobile nav items
  const NAV_MOBILE = [
    { id: 'overview',  label: 'Umumiy',    emoji: '📊' },
    { id: 'advisor',   label: 'AI Maslahat', emoji: '🤖' },
    { id: 'products',  label: 'Mahsulot',  emoji: '📦' },
    { id: 'orders',    label: 'Buyurtma',  emoji: '🛍️', badge: unreadOrdersCount > 0 ? unreadOrdersCount : null },
    { id: 'reviews',   label: 'Sharhlar',  emoji: '⭐', badge: reviewsCount > 0 ? reviewsCount : null },
    { id: 'messages',  label: 'Xabar',     emoji: '💬', badge: unreadMessagesCount > 0 ? unreadMessagesCount : null },
    { id: 'settings',  label: 'Profil',    emoji: '⚙️' },
  ];

  return (
    <div className="dashboard" data-active-tab={active}>
      {/* Mobile Header */}
      <header className="dash-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: '#111' }}>
          Hunarmand
        </div>
        <button className="dash-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      <div className={`dash-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div onClick={e => e.stopPropagation()} style={{ height: '100%' }}>
          <DashboardSidebar 
            active={active} 
            setActive={(tab) => { setActive(tab); setMobileMenuOpen(false); }}
            unreadOrders={unreadOrdersCount}
            unreadMessages={unreadMessagesCount}
            unreadReviews={reviewsCount}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="dash-sidebar-desktop">
        <DashboardSidebar 
          active={active} 
          setActive={setActive}
          unreadOrders={unreadOrdersCount}
          unreadMessages={unreadMessagesCount}
          unreadReviews={reviewsCount}
        />
      </div>

      {/* Main */}
      <main className="dash-main">
        {active === 'overview' && <DashboardOverview products={dashData.products} orders={dashData.orders} reviews={dashData.reviews}/>}
        {active === 'advisor' && <DashboardAdvisor user={user} />}
        {active === 'products' && (
          <DashboardProducts
            products={dashData.products}
            handleDeleteProduct={dashData.handleDeleteProduct}
            openAddProduct={openAddProduct}
            openEditProduct={openEditProduct}
          />
        )}
        {active === 'orders' && (
          <DashboardOrders orders={dashData.orders} openOrderDetails={openOrderDetails}/>
        )}
        {active === 'reviews' && <DashboardReviews reviews={dashData.reviews} handleReplyReview={dashData.handleReplyReview} />}
        {active === 'messages' && (
          <DashboardMessages
            messages={dashData.messages}
            selectedMsg={selectedMsg}
            selectMessageThread={(msg) => setSelectedMsg(dashData.selectMessageThread(msg))}
            handleSendReply={(reply, msg) => setSelectedMsg(dashData.handleSendReply(reply, msg))}
          />
        )}
        {active === 'settings' && (
          <DashboardSettings
            profile={dashData.profile}
            handleSaveProfile={dashData.handleSaveProfile}
            handleSaveShop={dashData.handleSaveShop}
            addToast={addToast}
          />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="dash-mobile-nav">
        {NAV_MOBILE.map(n => (
          <button
            key={n.id}
            className={`dash-mobile-nav-item ${active === n.id ? 'active' : ''}`}
            onClick={() => setActive(n.id)}
            style={{ position: 'relative' }}
          >
            <span style={{ fontSize: 20 }}>{n.emoji}</span>
            <span>{n.label}</span>
            {n.badge && <span className="dash-mobile-badge">{n.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Toasts rendered globally via ToastContainer */}

      {/* Add/Edit Product Modal */}
      {showProductModal && (
        <div className="admin-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}</h3>
              <button className="admin-modal-close" onClick={() => setShowProductModal(false)}>
                <XCircle size={18}/>
              </button>
            </div>
            <form onSubmit={submitProductForm}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Mahsulot nomi *</label>
                    <input className="form-input" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required/>
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">SKU (Kodi)</label>
                    <input className="form-input" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} placeholder="Masalan: CP-010"/>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Narxi (so'm) *</label>
                    <input type="number" className="form-input" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required/>
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Zaxira soni *</label>
                    <input type="number" className="form-input" value={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.value})} required/>
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Kategoriya</label>
                    <select className="form-input form-select" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Tayyorlash vaqti</label>
                    <input className="form-input" value={productForm.preparationTime} onChange={e => setProductForm({...productForm, preparationTime: e.target.value})} placeholder="Masalan: 2 hafta"/>
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Material(lar)</label>
                    <input className="form-input" value={productForm.material} onChange={e => setProductForm({...productForm, material: e.target.value})} placeholder="Masalan: Karbonli po'lat, kiyik shoxi"/>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Batafsil tavsif</label>
                  <textarea className="form-input" rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Mahsulot haqida batafsil ma'lumot kiriting..."></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mahsulot rasmlari</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(productForm.images || (productForm.image ? [productForm.image] : [])).map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: '#f5f4f2', flexShrink: 0 }}>
                          <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                          <button type="button" onClick={() => {
                            const newImages = (productForm.images || [productForm.image]).filter((_, i) => i !== idx);
                            setProductForm({...productForm, images: newImages, image: newImages[0] || ''});
                          }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, padding: 0 }}>✕</button>
                        </div>
                      ))}
                      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: '#f5f4f2', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <Upload size={22} color="#ccc"/>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={isUploading} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}/>
                      </div>
                    </div>
                    {isUploading && <span style={{ fontSize: 12, color: '#c97a22', display: 'block' }}>Yuklanmoqda...</span>}
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowProductModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isUploading}>Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="admin-modal-header" style={{ paddingBottom: 16 }}>
              <h3 style={{ fontSize: 18 }}>Buyurtma tafsilotlari - {selectedOrder.orderNumber || selectedOrder.id}</h3>
              <button className="admin-modal-close" onClick={() => setShowOrderModal(false)}><XCircle size={18}/></button>
            </div>
            
            <div className="admin-modal-body" style={{ padding: '24px', paddingTop: 8 }}>
              {/* Grid Top */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>MIJOZ</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginTop: 4 }}>
                    {typeof selectedOrder.customer === 'object' ? selectedOrder.customer?.name : selectedOrder.customer}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SANA</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginTop: 4 }}>
                    {selectedOrder.date || (selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('uz-UZ') : '')}
                  </div>
                </div>
              </div>

              {/* Product */}
              <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>MAHSULOT</span>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginTop: 4 }}>
                  {selectedOrder.product || (selectedOrder.items && selectedOrder.items.map(i => `${i.title} (x${i.quantity})`).join(', '))}
                </div>
              </div>

              {/* Amount & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>JAMI SUMMA</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#c97a22', marginTop: 4 }}>
                    {(selectedOrder.amount || selectedOrder.totalAmount) ? (selectedOrder.amount || selectedOrder.totalAmount).toLocaleString() + " so'm" : '—'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>JORIY HOLAT</span>
                  <div style={{ marginTop: 4 }}>
                    {selectedOrder.status === 'pending' && <span className="status-badge warning"><Clock size={14}/> Kutilmoqda</span>}
                    {selectedOrder.status === 'processing' && <span className="status-badge info"><RefreshCw size={14}/> Jarayonda</span>}
                    {selectedOrder.status === 'shipped' && <span className="status-badge info"><Truck size={14}/> Yuborildi</span>}
                    {selectedOrder.status === 'delivered' && <span className="status-badge success"><Check size={14}/> Yetkazildi</span>}
                    {selectedOrder.status === 'cancelled' && <span className="status-badge error"><XCircle size={14}/> Bekor qilindi</span>}
                    {selectedOrder.status === 'returned' && <span className="status-badge error"><RotateCcw size={14}/> Qaytarildi</span>}
                  </div>
                </div>
              </div>

              {/* Update Status Buttons */}
              <div style={{ paddingTop: 16 }}>
                <span style={{ fontSize: 13, color: '#555', fontWeight: 600, display: 'block', marginBottom: 12 }}>Holatni yangilash:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { id: 'pending', label: 'Kutilmoqda', icon: Clock },
                    { id: 'processing', label: 'Jarayonda', icon: RefreshCw },
                    { id: 'shipped', label: 'Yuborildi', icon: Truck },
                    { id: 'delivered', label: 'Yetkazildi', icon: Check },
                    { id: 'cancelled', label: 'Bekor qilindi', icon: XCircle },
                    { id: 'returned', label: 'Qaytarildi', icon: RotateCcw },
                  ].map(st => {
                    const isActive = selectedOrder.status === st.id;
                    const Icon = st.icon;
                    return (
                      <button
                        key={st.id}
                        onClick={() => {
                          dashData.handleUpdateOrderStatus(selectedOrder._id || selectedOrder.id, st.id);
                          setSelectedOrder({...selectedOrder, status: st.id});
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                          border: isActive ? 'none' : '1px solid #e5e5e5',
                          background: isActive ? '#c97a22' : '#fff',
                          color: isActive ? '#fff' : '#888',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={14} /> {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
            
            <div className="admin-modal-footer" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: 24, paddingRight: 24 }}>
              <button className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: 24 }} onClick={() => setShowOrderModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
