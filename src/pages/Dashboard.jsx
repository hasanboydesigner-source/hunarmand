import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  { id: 'overview',  label: 'Umumiy',       icon: <LayoutDashboard size={17}/> },
  { id: 'products',  label: 'Mahsulotlar',  icon: <Package size={17}/> },
  { id: 'orders',    label: 'Buyurtmalar',  icon: <ShoppingBag size={17}/> },
  { id: 'reviews',   label: 'Sharhlar',     icon: <Star size={17}/> },
  { id: 'messages',  label: 'Xabarlar',     icon: <MessageCircle size={17}/>, badge: 2 },
  { id: 'settings',  label: 'Sozlamalar',   icon: <Settings size={17}/> },
];

/* â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [active, setActive] = useState('overview');
  const navigate = useNavigate();

  // Orders filter
  const [orderFilter, setOrderFilter] = useState('all');
  const filteredOrders = orderFilter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === orderFilter);

  // Messages state
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [reply, setReply] = useState('');

  // Product search
  const [productQ, setProductQ] = useState('');
  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(productQ.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard">
      {/* â”€â”€ Sidebar â”€â”€ */}
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
          {NAV.map(n => (
            <button
              key={n.id}
              className={`dash-nav-item ${active === n.id ? 'active' : ''}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.badge && <span className="nav-badge">{n.badge}</span>}
            </button>
          ))}
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

      {/* â”€â”€ Main â”€â”€ */}
      <main className="dash-main">

        {/* â”€â”€ OVERVIEW â”€â”€ */}
        {active === 'overview' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <div>
                <p className="dash-eyebrow">Salom, {user?.name?.split(' ')[0] || 'Hunarmand'} ðŸ‘‹</p>
                <h1>Boshqaruv paneli</h1>
              </div>
              <button className="dash-btn-outline" onClick={() => setActive('messages')}>
                <Bell size={14}/> Bildirishnomalar
                <span className="nav-badge" style={{marginLeft:4}}>2</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
              {METRICS.map(m => (
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
                  <thead><tr><th>ID</th><th>Mahsulot</th><th>Mijoz</th><th>Holat</th><th>Summa</th></tr></thead>
                  <tbody>
                    {MOCK_ORDERS.slice(0, 4).map(o => (
                      <tr key={o.id}>
                        <td className="order-id">{o.id}</td>
                        <td>{o.product}</td>
                        <td>{o.customer}</td>
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
                {MOCK_PRODUCTS.filter(p => p.inStock <= 5).slice(0, 5).map(p => (
                  <div key={p.id} className="low-stock-item">
                    <img src={p.image} alt={p.title} className="low-stock-img"/>
                    <div className="low-stock-info">
                      <p>{p.title}</p>
                      <span className={`status-badge ${p.inStock === 0 ? 'status-cancelled' : 'status-processing'}`}>
                        {p.inStock === 0 ? 'Tugagan' : `${p.inStock} ta qoldi`}
                      </span>
                    </div>
                    <button className="dash-icon-btn"><Edit2 size={13}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ PRODUCTS â”€â”€ */}
        {active === 'products' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Mahsulotlarim</h1>
              <button className="btn btn-primary btn-sm"><Plus size={15}/> Mahsulot qo'shish</button>
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
                <thead><tr><th>Mahsulot</th><th>Kategoriya</th><th>Narx</th><th>Zaxira</th><th>Sotuv</th><th>Holat</th><th>Amal</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <img src={p.image} alt={p.title} className="product-cell-img"/>
                          <span>{p.title}</span>
                        </div>
                      </td>
                      <td><span className="cat-chip">{p.category}</span></td>
                      <td><strong>{formatPrice(p.price)}</strong></td>
                      <td>
                        <span className={`status-badge ${p.inStock === 0 ? 'status-cancelled' : p.inStock <= 3 ? 'status-processing' : 'status-delivered'}`}>
                          {p.inStock} ta
                        </span>
                      </td>
                      <td>{p.sold}</td>
                      <td><span className="status-badge status-delivered">Aktiv</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="dash-icon-btn" title="Ko'rish"><Eye size={13}/></button>
                          <button className="dash-icon-btn" title="Tahrirlash"><Edit2 size={13}/></button>
                          <button className="dash-icon-btn dash-icon-btn-danger" title="O'chirish"><Trash2 size={13}/></button>
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
                Barchasi <span className="filter-count">{MOCK_ORDERS.length}</span>
              </button>
              {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                <button
                  key={key}
                  className={`order-filter-btn ${orderFilter === key ? 'active' : ''}`}
                  onClick={() => setOrderFilter(key)}
                >
                  {STATUS_ICON[key]} {val.label}
                  <span className="filter-count">{MOCK_ORDERS.filter(o => o.status === key).length}</span>
                </button>
              ))}
            </div>
            <div className="dash-card">
              <div className="table-wrap">
              <table className="table">
                <thead><tr><th>ID</th><th>Mahsulot</th><th>Mijoz</th><th>Sana</th><th>Holat</th><th>Summa</th><th>Amal</th></tr></thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Bu holatda buyurtma yo'q</td></tr>
                  ) : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td>{o.product}</td>
                      <td>{o.customer}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{o.date}</td>
                      <td>
                        <span className={`status-badge status-${o.status}`}>
                          {STATUS_ICON[o.status]} {ORDER_STATUSES[o.status]?.label}
                        </span>
                      </td>
                      <td><strong>{formatPrice(o.amount)}</strong></td>
                      <td><button className="dash-btn-outline dash-btn-sm">Ko'rish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ REVIEWS â”€â”€ */}
        {active === 'reviews' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Sharhlar</h1>
              <div className="reviews-summary-pill">
                <Star size={14} fill="#f59e0b" color="#f59e0b"/>
                <strong>4.9</strong>
                <span>o'rtacha reyting Â· {MOCK_REVIEWS.length} ta sharh</span>
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
                    <span className="review-helpful-count">ðŸ‘ {r.helpful} ta foydali</span>
                    <button className="dash-btn-outline dash-btn-sm">
                      <Send size={12}/> Javob berish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ MESSAGES â”€â”€ */}
        {active === 'messages' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Xabarlar</h1>
              <span className="dash-count">{MOCK_MESSAGES.filter(m => m.unread).length} ta o'qilmagan</span>
            </div>
            <div className="messages-layout">
              {/* Thread list */}
              <div className="messages-list dash-card">
                {MOCK_MESSAGES.map(m => (
                  <button
                    key={m.id}
                    className={`message-item ${selectedMsg?.id === m.id ? 'active' : ''} ${m.unread ? 'unread' : ''}`}
                    onClick={() => setSelectedMsg(m)}
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
                    </div>
                    <div className="chat-input-wrap">
                      <input
                        className="chat-input"
                        placeholder="Javob yozing..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && reply.trim() && setReply('')}
                      />
                      <button
                        className="chat-send-btn"
                        onClick={() => setReply('')}
                        disabled={!reply.trim()}
                      >
                        <Send size={16}/>
                      </button>
                    </div>
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

        {/* â”€â”€ SETTINGS â”€â”€ */}
        {active === 'settings' && (
          <div className="animate-fadeIn">
            <div className="dash-section-header">
              <h1>Profil sozlamalari</h1>
            </div>
            <div className="settings-grid">
              <div className="dash-card settings-card">
                <h3>Asosiy ma'lumotlar</h3>
                <div className="form-group"><label className="form-label">Ism Familiya</label><input className="form-input" defaultValue={user?.name}/></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue={user?.email} type="email"/></div>
                <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" placeholder="+998 XX XXX XX XX"/></div>
                <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input form-textarea" rows={3} placeholder="O'zingiz haqingizda yozing..."/></div>
                <button className="btn btn-primary btn-sm">Saqlash</button>
              </div>
              <div className="dash-card settings-card">
                <h3>Do'kon sozlamalari</h3>
                <div className="form-group"><label className="form-label">Do'kon nomi</label><input className="form-input" defaultValue={(user?.name || '') + " Do'koni"}/></div>
                <div className="form-group"><label className="form-label">WhatsApp</label><input className="form-input" placeholder="+998901234567"/></div>
                <div className="form-group"><label className="form-label">Viloyat</label>
                  <select className="form-input form-select">
                    {['Toshkent','Samarqand','Buxoro','Namangan','Andijon','Farg\'ona'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Kategoriya</label>
                  <select className="form-input form-select">
                    {['Keramika','Zargarlik','Gilamchilik','Yog\'och o\'ymakori','To\'qimachilik'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary btn-sm">Saqlash</button>
              </div>
              <div className="dash-card settings-card" style={{ gridColumn: '1 / -1' }}>
                <h3>Xavfsizlik</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Joriy parol</label><input className="form-input" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"/></div>
                  <div className="form-group"><label className="form-label">Yangi parol</label><input className="form-input" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"/></div>
                  <div className="form-group"><label className="form-label">Tasdiqlash</label><input className="form-input" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"/></div>
                </div>
                <button className="btn btn-primary btn-sm">Parolni yangilash</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* â”€â”€ Mobile Bottom Nav â”€â”€ */}
      <nav className="dash-mobile-nav">
        {NAV.slice(0, 5).map(n => (
          <button
            key={n.id}
            className={`dash-mobile-nav-item${active === n.id ? ' active' : ''}`}
            onClick={() => setActive(n.id)}
          >
            {n.badge && <span className="dash-mobile-badge">{n.badge}</span>}
            {n.icon}
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>

  );
}
