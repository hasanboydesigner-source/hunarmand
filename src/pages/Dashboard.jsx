import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { MOCK_PRODUCTS, MOCK_REVIEWS, formatPrice, ORDER_STATUSES } from '../data/constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  LayoutDashboard, Package, ShoppingBag, Star, Settings,
  DollarSign, Eye, Plus, Edit2, Trash2,
  Bell, MessageCircle, ChevronRight, ChevronLeft, AlertTriangle,
  LogOut, Send, Search, Filter, CheckCircle2, Clock, Truck,
  XCircle, RefreshCw, TrendingUp, Users, Home
} from 'lucide-react';
import { GiPaintedPottery } from 'react-icons/gi';
import './Dashboard.css';

/* â”€â”€â”€ Static data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SALES_DATA = [
  { month: 'Yan', revenue: 1200000, orders: 14 },
  { month: 'Fev', revenue: 1800000, orders: 21 },
  { month: 'Mar', revenue: 1500000, orders: 18 },
  { month: 'Apr', revenue: 2400000, orders: 28 },
  { month: 'May', revenue: 2100000, orders: 24 },
  { month: 'Iyn', revenue: 3100000, orders: 36 },
];

const MOCK_ORDERS = [
  { id: '#HM-10234', product: 'Rishton Keramika Set',  customer: 'Zulfiya M.',  date: '2026-05-20', status: 'processing', amount: 360000 },
  { id: '#HM-10219', product: 'Keramika Piyola',       customer: 'Bobur T.',    date: '2026-05-18', status: 'shipped',    amount: 120000 },
  { id: '#HM-10198', product: 'Keramika Kosa',         customer: 'Kamola R.',   date: '2026-05-15', status: 'delivered',  amount: 240000 },
  { id: '#HM-10187', product: 'Dekorativ Tovoq',       customer: 'Alisher K.',  date: '2026-05-12', status: 'pending',    amount: 180000 },
  { id: '#HM-10171', product: 'Buxoro Gilamdek',       customer: 'Nodira S.',   date: '2026-05-10', status: 'cancelled',  amount: 95000  },
  { id: '#HM-10160', product: 'Atlas Mato',            customer: 'Jamshid U.',  date: '2026-05-08', status: 'delivered',  amount: 320000 },
];

const MOCK_MESSAGES = [
  { id: 1, from: 'Zulfiya M.',    avatar: 'Z', text: 'Mahsulotni qachon yuboresiz?', time: '10:32', unread: true,  thread: ["Mahsulotni qachon yuboresiz?","Ertaga jo'natiladi, raxmat!"] },
  { id: 2, from: 'Bobur T.',      avatar: 'B', text: 'Chegirma bormi?',              time: '09:14', unread: true,  thread: ["Chegirma bormi?"] },
  { id: 3, from: 'Kamola R.',     avatar: 'K', text: 'Rahmat, juda yoqdi!',          time: 'Kecha', unread: false, thread: ["Mahsulot yetib keldimi?","Ha, yetib keldi. Rahmat, juda yoqdi!"] },
  { id: 4, from: 'Alisher K.',    avatar: 'A', text: 'Buyurtma berishim mumkinmi?',  time: 'Kecha', unread: false, thread: ["Buyurtma berishim mumkinmi?"] },
];

const METRICS = [
  { label: 'Jami daromad',  value: '6 240 000', unit: "so'm", icon: <DollarSign size={20}/>, delta: '+18%', color: 'var(--success)' },
  { label: 'Buyurtmalar',   value: '141',        unit: 'ta',   icon: <ShoppingBag size={20}/>, delta: '+12%', color: 'var(--info)' },
  { label: 'Mahsulotlar',   value: '48',         unit: 'ta',   icon: <Package size={20}/>,     delta: '+3',   color: 'var(--brand-500)' },
  { label: 'Reyting',       value: '4.9',        unit: '/5',   icon: <Star size={20}/>,        delta: '+0.1', color: '#f59e0b' },
];

const STATUS_ICON = {
  pending:    <Clock size={13}/>,
  processing: <RefreshCw size={13}/>,
  shipped:    <Truck size={13}/>,
  delivered:  <CheckCircle2 size={13}/>,
  cancelled:  <XCircle size={13}/>,
};

const NAV = [
  { id: 'overview',  label: 'Umumiy',       labelMobile: 'Umumiy',     icon: <LayoutDashboard size={17}/> },
  { id: 'products',  label: 'Mahsulotlar',  labelMobile: 'Mahsulot',   icon: <Package size={17}/> },
  { id: 'orders',    label: 'Buyurtmalar',  labelMobile: 'Buyurtma',   icon: <ShoppingBag size={17}/> },
  { id: 'reviews',   label: 'Sharhlar',     labelMobile: 'Sharh',      icon: <Star size={17}/> },
  { id: 'messages',  label: 'Xabarlar',     labelMobile: 'Xabar',      icon: <MessageCircle size={17}/>, badge: 2 },
  { id: 'settings',  label: 'Sozlamalar',   labelMobile: 'Profil',     icon: <Settings size={17}/> },
];

/* â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500',
  'https://images.unsplash.com/photo-1501369790715-4ba81f1807d9?w=500',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500'
];

/* ─── Component ──────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, logout, updateUser } = useAuthStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'overview';
  const [active, setActive] = useState(defaultTab);
  const navigate = useNavigate();

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Initialize global state from localStorage or MOCK data
  const [allProducts, setAllProducts] = useState(() => {
    const saved = localStorage.getItem('hunarmand_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem('hunarmand_orders');
    if (saved) return JSON.parse(saved);
    // Distribute mock orders among the 4 demo craftsmen
    return MOCK_ORDERS.map((o, i) => ({ ...o, craftsmanId: 'c' + ((i % 4) + 1) }));
  });

  const [allMessages, setAllMessages] = useState(() => {
    const saved = localStorage.getItem('hunarmand_messages');
    if (saved) return JSON.parse(saved);
    // Distribute mock messages among the 4 demo craftsmen
    return MOCK_MESSAGES.map((m, i) => ({ ...m, craftsmanId: 'c' + ((i % 4) + 1) }));
  });

  // Derived filtered data for the CURRENT craftsman
  const products = allProducts.filter(p => p.craftsman?.id === user?.id);
  const orders = allOrders.filter(o => o.craftsmanId === user?.id);
  const messages = allMessages.filter(m => m.craftsmanId === user?.id);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('hunarmand_profile_' + user?.id);
    if (saved) return JSON.parse(saved);
    return {
      name: user?.name || 'Hasanboy',
      email: user?.email || 'designer@hunarmand.uz',
      phone: '+998 90 123 45 67',
      bio: 'Premium sifatdagi kulolchilik mahsulotlari ustasi.',
      shopName: (user?.name || 'Hasanboy') + ' ustaxonasi',
      whatsapp: '+998901234567',
      region: 'Farg\'ona',
      category: 'Keramika'
    };
  });

  // Modals States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    inStock: '',
    category: 'Keramika',
    image: PRESET_IMAGES[0]
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Orders filter
  const [orderFilter, setOrderFilter] = useState('all');
  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  // Messages chat state
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [reply, setReply] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMsg, messages]);

  // Product search
  const [productQ, setProductQ] = useState('');
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productQ.toLowerCase())
  );

  // Calculate dynamic metrics
  const activeProductsCount = products.length;
  const activeOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => o.status === 'delivered' || o.status === 'processing')
    .reduce((sum, o) => sum + o.amount, 0);
  const averageRating = 4.9;

  const dynamicMetrics = [
    { label: 'Jami daromad',  value: formatPrice(totalRevenue), unit: "", icon: <DollarSign size={20}/>, delta: '+18%', color: 'var(--success)' },
    { label: 'Buyurtmalar',   value: String(activeOrdersCount),    unit: 'ta',   icon: <ShoppingBag size={20}/>, delta: '+12%', color: 'var(--info)' },
    { label: 'Mahsulotlar',   value: String(activeProductsCount),  unit: 'ta',   icon: <Package size={20}/>,     delta: '+3',   color: 'var(--brand-500)' },
    { label: 'Reyting',       value: String(averageRating),        unit: '/5',   icon: <Star size={20}/>,        delta: '+0.1', color: '#f59e0b' },
  ];

  const unreadMessagesCount = messages.filter(m => m.unread).length;

  // CRUD & Handlers
  const handleLogout = () => { logout(); navigate('/'); };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      price: '',
      inStock: '',
      category: 'Keramika',
      image: PRESET_IMAGES[0]
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      price: String(prod.price),
      inStock: String(prod.inStock),
      category: prod.category || 'Keramika',
      image: prod.image || PRESET_IMAGES[0]
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || !productForm.inStock) {
      addToast("Barcha maydonlarni to'ldiring!", 'error');
      return;
    }
    const priceNum = parseFloat(productForm.price);
    const stockNum = parseInt(productForm.inStock);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast("Narxni to'g'ri kiriting!", 'error');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      addToast("Zaxirani to'g'ri kiriting!", 'error');
      return;
    }

    if (editingProduct) {
      const updated = allProducts.map(p => p.id === editingProduct.id ? {
        ...p,
        title: productForm.title,
        price: priceNum,
        inStock: stockNum,
        category: productForm.category,
        image: productForm.image
      } : p);
      setAllProducts(updated);
      localStorage.setItem('hunarmand_products', JSON.stringify(updated));
      addToast("Mahsulot muvaffaqiyatli tahrirlandi!", 'success');
    } else {
      const newProduct = {
        id: String(Date.now()),
        title: productForm.title,
        price: priceNum,
        inStock: stockNum,
        sold: 0,
        category: productForm.category,
        image: productForm.image,
        rating: 5,
        reviews: [],
        craftsman: { id: user?.id, name: user?.name, region: profile.region, rating: 5, avatar: null }
      };
      const updated = [newProduct, ...allProducts];
      setAllProducts(updated);
      localStorage.setItem('hunarmand_products', JSON.stringify(updated));
      addToast("Yangi mahsulot muvaffaqiyatli qo'shildi!", 'success');
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchisiz?")) {
      const updated = allProducts.filter(p => p.id !== id);
      setAllProducts(updated);
      localStorage.setItem('hunarmand_products', JSON.stringify(updated));
      addToast("Mahsulot o'chirildi!", 'info');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setAllOrders(updated);
    localStorage.setItem('hunarmand_orders', JSON.stringify(updated));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
    addToast(`Buyurtma holati yangilandi: ${ORDER_STATUSES[newStatus]?.label}`, 'success');
  };

  const selectMessageThread = (msg) => {
    setSelectedMsg(msg);
    const updated = allMessages.map(m => m.id === msg.id ? { ...m, unread: false } : m);
    setAllMessages(updated);
    localStorage.setItem('hunarmand_messages', JSON.stringify(updated));
  };

  const handleSendReply = (e) => {
    if (e) e.preventDefault();
    if (!reply.trim() || !selectedMsg) return;
    const updated = allMessages.map(m => {
      if (m.id === selectedMsg.id) {
        const newThread = [...m.thread, reply];
        return { ...m, thread: newThread, text: reply, time: 'Hozir' };
      }
      return m;
    });
    setAllMessages(updated);
    localStorage.setItem('hunarmand_messages', JSON.stringify(updated));
    setSelectedMsg(prev => prev ? {
      ...prev,
      thread: [...prev.thread, reply],
      text: reply,
      time: 'Hozir'
    } : null);
    setReply('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name: profile.name, email: profile.email });
    localStorage.setItem('hunarmand_profile_' + user?.id, JSON.stringify(profile));
    addToast("Profil ma'lumotlari saqlandi!", 'success');
  };

  const handleSaveShop = (e) => {
    e.preventDefault();
    localStorage.setItem('hunarmand_profile_' + user?.id, JSON.stringify(profile));
    addToast("Do'kon sozlamalari muvaffaqiyatli saqlandi!", 'success');
  };

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      addToast("Barcha parollarni kiriting!", 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      addToast("Yangi parollar mos kelmadi!", 'error');
      return;
    }
    if (passwords.new.length < 6) {
      addToast("Yangi parol kamida 6 belgidan iborat bo'lishi kerak!", 'error');
      return;
    }
    addToast("Parol muvaffaqiyatli yangilandi!", 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="dashboard" data-active-tab={active}>
      {/* ── Mobile Top Bar ── */}
      <header className="dash-mobile-header">
        <div className="dash-brand">
          <div className="dash-brand-icon"><GiPaintedPottery size={16}/></div>
          <span>Hunarmand</span>
        </div>
        <div className="dash-mobile-header-actions">
          <Link to="/" className="dash-mobile-icon-btn" title="Bosh sahifaga">
            <Home size={18}/>
          </Link>
          <button className="dash-mobile-icon-btn" onClick={handleLogout} title="Chiqish">
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <div className="dash-brand">
            <div className="dash-brand-icon"><GiPaintedPottery size={18}/></div>
            <span>Hunarmand</span>
          </div>
          <div className="dash-user">
            <div className="avatar avatar-md">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'HM'}
            </div>
            <div>
              <p className="dash-user-name">{user?.name || 'Hunarmand'}</p>
              <p className="dash-user-role">Hunarmand</p>
            </div>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(n => {
            const badgeVal = n.id === 'messages' ? unreadMessagesCount : n.badge;
            return (
              <button
                key={n.id}
                className={`dash-nav-item ${active === n.id ? 'active' : ''}`}
                onClick={() => setActive(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
                {badgeVal > 0 && <span className="nav-badge">{badgeVal}</span>}
              </button>
            );
          })}
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/" className="dash-back-link">
            <ChevronLeft size={14}/> Bosh sahifaga
          </Link>
          <button className="dash-logout-btn" onClick={handleLogout}>
            <LogOut size={14}/> <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">

        {/* ── OVERVIEW ── */}
        {active === 'overview' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <div>
                <p className="dash-eyebrow">Salom, {user?.name?.split(' ')[0] || 'Hunarmand'} 👋</p>
                <h1>Boshqaruv paneli</h1>
              </div>
              <button className="dash-btn-outline" onClick={() => setActive('messages')}>
                <Bell size={14}/> Bildirishnomalar
                {unreadMessagesCount > 0 && <span className="nav-badge" style={{marginLeft:4}}>{unreadMessagesCount}</span>}
              </button>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
              {dynamicMetrics.map(m => (
                <div key={m.label} className="metric-card">
                  <div className="metric-icon" style={{ background: m.color + '18', color: m.color }}>{m.icon}</div>
                  <div className="metric-info">
                    <p className="metric-label">{m.label}</p>
                    <div className="metric-value-row">
                      <strong>{m.value}</strong><span>{m.unit}</span>
                    </div>
                  </div>
                  <span className="metric-delta positive"><TrendingUp size={11}/> {m.delta}</span>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Oylik daromad</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={SALES_DATA}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#d4822a" stopOpacity={0.28}/>
                        <stop offset="95%" stopColor="#d4822a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)"/>
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }}/>
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => (v/1000000).toFixed(1)+'M'}/>
                    <Tooltip
                      formatter={v => [formatPrice(v), 'Daromad']}
                      contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#d4822a" strokeWidth={2.5} fill="url(#grad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Buyurtmalar soni</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)"/>
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }}/>
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }}/>
                    <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }}/>
                    <Bar dataKey="orders" fill="#d4822a" radius={[5, 5, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom grid */}
            <div className="dash-bottom-grid">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>So'nggi buyurtmalar</h3>
                  <button className="dash-btn-ghost" onClick={() => setActive('orders')}>Barchasi <ChevronRight size={13}/></button>
                </div>
                <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>ID</th><th>Mahsulot</th><th className="hide-mobile">Mijoz</th><th>Holat</th><th>Summa</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 4).map(o => (
                      <tr key={o.id} onClick={() => openOrderDetails(o)} style={{ cursor: 'pointer' }} title="Tafsilotlarni ko'rish">
                        <td className="order-id">{o.id}</td>
                        <td>{o.product}</td>
                        <td className="hide-mobile">{o.customer}</td>
                        <td>
                          <span className={`status-badge status-${o.status}`}>
                            {STATUS_ICON[o.status]} {ORDER_STATUSES[o.status]?.label}
                          </span>
                        </td>
                        <td><strong>{formatPrice(o.amount)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3><AlertTriangle size={15} color="var(--warning)"/> Kam qolgan</h3>
                </div>
                {products.filter(p => p.inStock <= 5).slice(0, 5).map(p => (
                  <div key={p.id} className="low-stock-item">
                    <img src={p.image} alt={p.title} className="low-stock-img"/>
                    <div className="low-stock-info">
                      <p>{p.title}</p>
                      <span className={`status-badge ${p.inStock === 0 ? 'status-cancelled' : 'status-processing'}`}>
                        {p.inStock === 0 ? 'Tugagan' : `${p.inStock} ta qoldi`}
                      </span>
                    </div>
                    <button className="dash-icon-btn" onClick={() => openEditProduct(p)} title="Tahrirlash"><Edit2 size={13}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {active === 'products' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Mahsulotlarim</h1>
              <button className="btn btn-primary btn-sm" onClick={openAddProduct}><Plus size={15}/> Mahsulot qo'shish</button>
            </div>
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-search-wrap">
                  <Search size={15} className="dash-search-icon"/>
                  <input
                    className="dash-search-input"
                    placeholder="Mahsulot qidirish..."
                    value={productQ}
                    onChange={e => setProductQ(e.target.value)}
                  />
                </div>
                <span className="dash-count">{filteredProducts.length} ta mahsulot</span>
              </div>
              <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th className="hide-mobile">Kategoriya</th>
                    <th>Narx</th>
                    <th>Zaxira</th>
                    <th className="hide-mobile">Sotuv</th>
                    <th className="hide-mobile">Holat</th>
                    <th>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <img src={p.image} alt={p.title} className="product-cell-img"/>
                          <span>{p.title}</span>
                        </div>
                      </td>
                      <td className="hide-mobile"><span className="cat-chip">{p.category}</span></td>
                      <td><strong>{formatPrice(p.price)}</strong></td>
                      <td>
                        <span className={`status-badge ${p.inStock === 0 ? 'status-cancelled' : p.inStock <= 3 ? 'status-processing' : 'status-delivered'}`}>
                          {p.inStock} ta
                        </span>
                      </td>
                      <td className="hide-mobile">{p.sold}</td>
                      <td className="hide-mobile"><span className="status-badge status-delivered">Aktiv</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="dash-icon-btn" onClick={() => window.open('/', '_blank')} title="Do'konda ko'rish"><Eye size={13}/></button>
                          <button className="dash-icon-btn" onClick={() => openEditProduct(p)} title="Tahrirlash"><Edit2 size={13}/></button>
                          <button className="dash-icon-btn dash-icon-btn-danger" onClick={() => handleDeleteProduct(p.id)} title="O'chirish"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ ORDERS â”€â”€ */}
        {active === 'orders' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Buyurtmalar</h1>
              <span className="dash-count">{filteredOrders.length} ta buyurtma</span>
            </div>
            <div className="order-filters">
              <button
                className={`order-filter-btn ${orderFilter === 'all' ? 'active' : ''}`}
                onClick={() => setOrderFilter('all')}
              >
                Barchasi <span className="filter-count">{orders.length}</span>
              </button>
              {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                <button
                  key={key}
                  className={`order-filter-btn ${orderFilter === key ? 'active' : ''}`}
                  onClick={() => setOrderFilter(key)}
                >
                  {STATUS_ICON[key]} {val.label}
                  <span className="filter-count">{orders.filter(o => o.status === key).length}</span>
                </button>
              ))}
            </div>
            <div className="dash-card">
              <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mahsulot</th>
                    <th className="hide-mobile">Mijoz</th>
                    <th className="hide-mobile">Sana</th>
                    <th>Holat</th>
                    <th>Summa</th>
                    <th>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Bu holatda buyurtma yo'q</td></tr>
                  ) : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td>{o.product}</td>
                      <td className="hide-mobile">{o.customer}</td>
                      <td className="hide-mobile" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{o.date}</td>
                      <td>
                        <span className={`status-badge status-${o.status}`}>
                          {STATUS_ICON[o.status]} {ORDER_STATUSES[o.status]?.label}
                        </span>
                      </td>
                      <td><strong>{formatPrice(o.amount)}</strong></td>
                      <td><button className="dash-btn-outline dash-btn-sm" onClick={() => openOrderDetails(o)}>Ko'rish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {active === 'reviews' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Sharhlar</h1>
              <div className="reviews-summary-pill">
                <Star size={14} fill="#f59e0b" color="#f59e0b"/>
                <strong>4.9</strong>
                <span>o'rtacha reyting · {MOCK_REVIEWS.length} ta sharh</span>
              </div>
            </div>
            <div className="reviews-grid">
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className="dash-review-card">
                  <div className="review-header">
                    <div className="avatar avatar-sm">{r.author[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong>{r.author}</strong>
                        {r.verified && <span className="verified-purchase"><CheckCircle2 size={11}/> Tasdiqlangan</span>}
                      </div>
                      <div className="stars-row">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={13} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : 'var(--border-medium)'}/>
                        ))}
                      </div>
                    </div>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <div className="review-footer">
                    <span className="review-helpful-count">👍 {r.helpful} ta foydali</span>
                    <button className="dash-btn-outline dash-btn-sm" onClick={() => {
                      const replyText = prompt("Javob matnini kiriting:");
                      if (replyText && replyText.trim()) {
                        addToast("Javobingiz muvaffaqiyatli jo'natildi!", 'success');
                      }
                    }}>
                      <Send size={12}/> Javob berish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {active === 'messages' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Xabarlar</h1>
              <span className="dash-count">{unreadMessagesCount} ta o'qilmagan</span>
            </div>
            <div className={`messages-layout ${selectedMsg ? 'chat-open' : ''}`}>
              {/* Thread list */}
              <div className="messages-list dash-card">
                {messages.map(m => (
                  <button
                    key={m.id}
                    className={`message-item ${selectedMsg?.id === m.id ? 'active' : ''} ${m.unread ? 'unread' : ''}`}
                    onClick={() => selectMessageThread(m)}
                  >
                    <div className="avatar avatar-sm">{m.avatar}</div>
                    <div className="message-item-body">
                      <div className="message-item-top">
                        <strong>{m.from}</strong>
                        <span className="message-time">{m.time}</span>
                      </div>
                      <p className="message-preview">{m.text}</p>
                    </div>
                    {m.unread && <span className="unread-dot"/>}
                  </button>
                ))}
              </div>

              {/* Chat window */}
              <div className="message-chat dash-card">
                {selectedMsg ? (
                  <>
                    <div className="chat-header">
                      <button 
                        className="chat-back-btn hide-desktop" 
                        onClick={() => setSelectedMsg(null)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          padding: '4px 8px 4px 0', 
                          cursor: 'pointer', 
                          color: 'var(--text-primary)',
                          marginRight: '4px'
                        }}
                      >
                        <ChevronLeft size={20}/>
                      </button>
                      <div className="avatar avatar-sm">{selectedMsg.avatar}</div>
                      <div>
                        <strong>{selectedMsg.from}</strong>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mijoz</p>
                      </div>
                    </div>
                    <div className="chat-body">
                      {selectedMsg.thread.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${i % 2 === 0 ? 'from' : 'to'}`}>
                          {msg}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendReply} className="chat-input-wrap">
                      <input
                        className="chat-input"
                        placeholder="Javob yozing..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="chat-send-btn"
                        disabled={!reply.trim()}
                      >
                        <Send size={16}/>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="chat-empty">
                    <MessageCircle size={40} opacity={0.2}/>
                    <p>Suhbatni tanlang</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {active === 'settings' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Profil sozlamalari</h1>
            </div>
            <div className="settings-grid">
              <form onSubmit={handleSaveProfile} className="dash-card settings-card">
                <h3>Asosiy ma'lumotlar</h3>
                <div className="form-group"><label className="form-label">Ism Familiya</label><input className="form-input" value={profile.name} onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={profile.email} onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={profile.phone} onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))} placeholder="+998 XX XXX XX XX"/></div>
                <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input form-textarea" rows={3} value={profile.bio} onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))} placeholder="O'zingiz haqingizda yozing..."/></div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>
              <form onSubmit={handleSaveShop} className="dash-card settings-card">
                <h3>Do'kon sozlamalari</h3>
                <div className="form-group"><label className="form-label">Do'kon nomi</label><input className="form-input" value={profile.shopName} onChange={e => setProfile(prev => ({ ...prev, shopName: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">WhatsApp</label><input className="form-input" value={profile.whatsapp} onChange={e => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="+998901234567"/></div>
                <div className="form-group"><label className="form-label">Viloyat</label>
                  <select className="form-input form-select" value={profile.region} onChange={e => setProfile(prev => ({ ...prev, region: e.target.value }))}>
                    {['Toshkent','Samarqand','Buxoro','Namangan','Andijon','Farg\'ona'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Kategoriya</label>
                  <select className="form-input form-select" value={profile.category} onChange={e => setProfile(prev => ({ ...prev, category: e.target.value }))}>
                    {['Keramika','Zargarlik','Gilamchilik','Yog\'och o\'ymakori','To\'qimachilik'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>
              <form onSubmit={handleUpdatePassword} className="dash-card settings-card" style={{ gridColumn: '1 / -1' }}>
                <h3>Xavfsizlik</h3>
                <div className="settings-row-grid">
                  <div className="form-group"><label className="form-label">Joriy parol</label><input className="form-input" type="password" value={passwords.current} onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))} placeholder="••••••"/></div>
                  <div className="form-group"><label className="form-label">Yangi parol</label><input className="form-input" type="password" value={passwords.new} onChange={e => setPasswords(prev => ({ ...prev, new: e.target.value }))} placeholder="••••••"/></div>
                  <div className="form-group"><label className="form-label">Tasdiqlash</label><input className="form-input" type="password" value={passwords.confirm} onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} placeholder="••••••"/></div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Parolni yangilash</button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="dash-mobile-nav">
        {NAV.map(n => {
          const badgeVal = n.id === 'messages' ? unreadMessagesCount : n.badge;
          return (
            <button
              key={n.id}
              className={`dash-mobile-nav-item ${active === n.id ? 'active' : ''}`}
              onClick={() => setActive(n.id)}
            >
              {badgeVal > 0 && <span className="dash-mobile-badge">{badgeVal}</span>}
              {n.icon}
              <span>{n.labelMobile}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Toasts Container ── */}
      <div className="toasts-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={16} color="var(--success)"/>}
            {t.type === 'error' && <AlertTriangle size={16} color="var(--error)"/>}
            {t.type === 'info' && <Bell size={16} color="var(--info)"/>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── Product Add/Edit Modal ── */}
      {showProductModal && (
        <div className="dash-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>{editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h3>
              <button className="dash-modal-close" onClick={() => setShowProductModal(false)}><XCircle size={18}/></button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="dash-modal-body">
                <div className="form-group">
                  <label className="form-label">Mahsulot nomi</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={productForm.title}
                    onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Masalan, Rishton Sopol Ko'zasi"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Narxi (so'm)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={productForm.price}
                      onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="350000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Zaxira soni (dona)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={productForm.inStock}
                      onChange={e => setProductForm(p => ({ ...p, inStock: e.target.value }))}
                      placeholder="15"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Kategoriya</label>
                  <select
                    className="form-input form-select"
                    value={productForm.category}
                    onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {['Keramika','Zargarlik','Gilamchilik','Yog\'och o\'ymakori','To\'qimachilik'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mahsulot rasmi</label>
                  <input
                    className="form-input"
                    type="text"
                    value={productForm.image}
                    onChange={e => setProductForm(p => ({ ...p, image: e.target.value }))}
                    placeholder="Rasm havolasi (URL)"
                  />
                  <div className="preset-images-grid">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-image-option ${productForm.image === img ? 'selected' : ''}`}
                        onClick={() => setProductForm(p => ({ ...p, image: img }))}
                      >
                        <img src={img} alt={`Preset ${idx}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="dash-modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowProductModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary btn-sm">{editingProduct ? "Saqlash" : "Qo'shish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {showOrderModal && selectedOrder && (
        <div className="dash-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>Buyurtma tafsilotlari - {selectedOrder.id}</h3>
              <button className="dash-modal-close" onClick={() => setShowOrderModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="dash-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mijoz</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sana</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.date}</p>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mahsulot</span>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.product}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jami summa</span>
                    <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--brand-600)' }}>{formatPrice(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joriy Holat</span>
                    <div style={{ marginTop: 4 }}>
                      <span className={`status-badge status-${selectedOrder.status}`}>
                        {STATUS_ICON[selectedOrder.status]} {ORDER_STATUSES[selectedOrder.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: '8px' }}>Holatni yangilash:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        className={`order-filter-btn ${selectedOrder.status === key ? 'active' : ''}`}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, key)}
                      >
                        {STATUS_ICON[key]} {val.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="dash-modal-footer">
              <button className="btn btn-primary btn-sm" onClick={() => setShowOrderModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
