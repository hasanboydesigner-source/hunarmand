import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { MOCK_PRODUCTS, MOCK_CRAFTSMEN, formatPrice, ORDER_STATUSES } from '../data/constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, ShoppingBag, DollarSign, Shield, Settings, BarChart2, AlertTriangle, CheckCircle2, XCircle, Eye, Trash2, Edit2, ChevronRight, LogOut } from 'lucide-react';
import './Admin.css';

const REVENUE_DATA = [
  {month:'Yan',revenue:12000000},{month:'Fev',revenue:18000000},{month:'Mar',revenue:15000000},
  {month:'Apr',revenue:24000000},{month:'May',revenue:21000000},{month:'Iyn',revenue:31000000},
];
const PIE_DATA = [
  {name:'Keramika',value:34,color:'#e8a042'},{name:'Gilam',value:22,color:'#059669'},
  {name:'Zargarlik',value:18,color:'#7c3aed'},{name:'Boshqa',value:26,color:'#6b7280'},
];

const PLATFORM_METRICS = [
  { label:'Jami foydalanuvchi', value:'12,483', icon:<Users size={20}/>,     delta:'+234', color:'var(--info)' },
  { label:'Faol mahsulotlar',  value:'18,241', icon:<Package size={20}/>,    delta:'+89',  color:'var(--brand-500)' },
  { label:"Jami buyurtmalar",  value:'94,210', icon:<ShoppingBag size={20}/>,delta:'+1.2K',color:'var(--success)' },
  { label:'Jami daromad',      value:'2.4B',   icon:<DollarSign size={20}/>, delta:'+18%', color:'#f59e0b',unit:"so'm" },
];

const MOCK_USERS = [
  {id:'u1',name:'Zulfiya Mamatova', email:'zulfiya@mail.uz', role:'customer', status:'active',  joined:'2025-03-12'},
  {id:'u2',name:'Akbar Nazarov',    email:'akbar@mail.uz',   role:'craftsman',status:'active',  joined:'2020-03-15'},
  {id:'u3',name:'Jamshid Umarov',   email:'jamshid@mail.uz', role:'craftsman',status:'active',  joined:'2019-07-10'},
  {id:'u4',name:'Bobur Toshmatov',  email:'bobur@mail.uz',   role:'customer', status:'banned',  joined:'2024-11-20'},
];

const NAV = [
  {id:'overview',  label:'Umumiy',        icon:<BarChart2 size={17}/>},
  {id:'users',     label:'Foydalanuvchilar',icon:<Users size={17}/>},
  {id:'products',  label:'Mahsulotlar',   icon:<Package size={17}/>},
  {id:'craftsmen', label:'Hunarmandlar',  icon:<Shield size={17}/>},
  {id:'orders',    label:'Buyurtmalar',   icon:<ShoppingBag size={17}/>},
  {id:'settings',  label:'Sozlamalar',    icon:<Settings size={17}/>},
];

export default function AdminPage() {
  const [active, setActive] = useState('overview');
  const { user, logout } = useAuthStore();
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

  // Persistent states initialized from localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hunarmand_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('hunarmand_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [craftsmen, setCraftsmen] = useState(() => {
    const saved = localStorage.getItem('hunarmand_craftsmen');
    return saved ? JSON.parse(saved) : MOCK_CRAFTSMEN;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hunarmand_orders');
    return saved ? JSON.parse(saved) : [
      { id: '#HM-10234', product: 'Rishton Keramika Set',  customer: 'Zulfiya M.',  date: '2026-05-20', status: 'processing', amount: 360000 },
      { id: '#HM-10219', product: 'Keramika Piyola',       customer: 'Bobur T.',    date: '2026-05-18', status: 'shipped',    amount: 120000 },
      { id: '#HM-10198', product: 'Keramika Kosa',         customer: 'Kamola R.',   date: '2026-05-15', status: 'delivered',  amount: 240000 },
      { id: '#HM-10187', product: 'Dekorativ Tovoq',       customer: 'Alisher K.',  date: '2026-05-12', status: 'pending',    amount: 180000 },
      { id: '#HM-10171', product: 'Buxoro Gilamdek',       customer: 'Nodira S.',   date: '2026-05-10', status: 'cancelled',  amount: 95000  },
      { id: '#HM-10160', product: 'Atlas Mato',            customer: 'Jamshid U.',  date: '2026-05-08', status: 'delivered',  amount: 320000 },
    ];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hunarmand_admin_settings');
    return saved ? JSON.parse(saved) : {
      commissionStandard: '8',
      commissionPremium: '5',
      shippingStandard: '30000',
      shippingFreeLimit: '500000',
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smsApiKey: '****',
      smsSenderName: 'HUNARMAND'
    };
  });

  // Searching & Filtering States
  const [userSearchQ, setUserSearchQ] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [productSearchQ, setProductSearchQ] = useState('');
  const [craftsmenSearchQ, setCraftsmenSearchQ] = useState('');
  const [orderSearchQ, setOrderSearchQ] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals States
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [showCraftsmanModal, setShowCraftsmanModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Filter computations
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQ.toLowerCase()) || u.email.toLowerCase().includes(userSearchQ.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearchQ.toLowerCase())
  );

  const filteredCraftsmen = craftsmen.filter(c =>
    c.name.toLowerCase().includes(craftsmenSearchQ.toLowerCase()) || c.region.toLowerCase().includes(craftsmenSearchQ.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.product.toLowerCase().includes(orderSearchQ.toLowerCase()) || o.customer.toLowerCase().includes(orderSearchQ.toLowerCase()) || o.id.toLowerCase().includes(orderSearchQ.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action methods
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleUserStatus = (userId) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'banned' : 'active';
        addToast(newStatus === 'banned' ? `${u.name} bloklandi!` : `${u.name} blokdan chiqarildi!`, newStatus === 'banned' ? 'error' : 'success');
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('hunarmand_users', JSON.stringify(updated));
  };

  const handleApproveProduct = (prodId) => {
    const updated = products.map(p => {
      if (p.id === prodId) {
        addToast(`"${p.title}" muvaffaqiyatli tasdiqlandi!`, 'success');
        return { ...p, status: 'approved' };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('hunarmand_products', JSON.stringify(updated));
  };

  const handleRejectProduct = (prodId) => {
    const reason = prompt("Rad etish sababini kiriting:");
    if (reason === null) return;
    if (!reason.trim()) {
      addToast("Rad etish sababi bo'sh bo'lishi mumkin emas!", 'error');
      return;
    }
    const updated = products.map(p => {
      if (p.id === prodId) {
        addToast(`"${p.title}" rad etildi. Sababi: ${reason}`, 'info');
        return { ...p, status: 'rejected', rejectReason: reason };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('hunarmand_products', JSON.stringify(updated));
  };

  const handleDeleteProduct = (prodId) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni platformadan o'chirmoqchisiz?")) {
      const updated = products.filter(p => p.id !== prodId);
      setProducts(updated);
      localStorage.setItem('hunarmand_products', JSON.stringify(updated));
      addToast("Mahsulot o'chirildi!", 'info');
    }
  };

  const handleVerifyCraftsman = (craftId) => {
    const updated = craftsmen.map(c => {
      if (c.id === craftId) {
        addToast(`"${c.name}" muvaffaqiyatli tasdiqlandi!`, 'success');
        return { ...c, isVerified: true };
      }
      return c;
    });
    setCraftsmen(updated);
    localStorage.setItem('hunarmand_craftsmen', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('hunarmand_orders', JSON.stringify(updated));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
    addToast(`Buyurtma holati yangilandi: ${ORDER_STATUSES[newStatus]?.label}`, 'success');
  };

  const handleSaveSettings = (e, section) => {
    e.preventDefault();
    localStorage.setItem('hunarmand_admin_settings', JSON.stringify(settings));
    addToast(`"${section}" muvaffaqiyatli saqlandi!`, 'success');
  };

  // Dynamic calculations
  const totalRev = orders
    .filter(o => o.status === 'delivered' || o.status === 'processing')
    .reduce((sum, o) => sum + o.amount, 0);

  const dynamicPlatformMetrics = [
    { label:'Jami foydalanuvchi', value: String(12480 + users.length), icon:<Users size={20}/>,     delta:'+234', color:'var(--info)' },
    { label:'Faol mahsulotlar',  value: String(products.length), icon:<Package size={20}/>,    delta:'+89',  color:'var(--brand-500)' },
    { label:"Jami buyurtmalar",  value: String(94200 + orders.length), icon:<ShoppingBag size={20}/>,delta:'+1.2K',color:'var(--success)' },
    { label:'Jami daromad',      value: formatPrice(2400000000 + totalRev), icon:<DollarSign size={20}/>, delta:'+18%', color:'#f59e0b',unit:"" },
  ];

  const ceramicCount = products.filter(p => p.category === 'keramika').length;
  const carpetCount = products.filter(p => p.category === 'gilam').length;
  const jewelryCount = products.filter(p => p.category === 'zargarlik').length;
  const otherCount = products.length - (ceramicCount + carpetCount + jewelryCount);
  const totalProds = products.length || 1;
  const dynamicPieData = [
    { name: 'Keramika', value: Math.round((ceramicCount / totalProds) * 100), color: '#e8a042' },
    { name: 'Gilam', value: Math.round((carpetCount / totalProds) * 100), color: '#059669' },
    { name: 'Zargarlik', value: Math.round((jewelryCount / totalProds) * 100), color: '#7c3aed' },
    { name: 'Boshqa', value: Math.round((otherCount / totalProds) * 100), color: '#6b7280' },
  ];

  const pendingCraftsmenCount = craftsmen.filter(c => !c.isVerified).length;
  const rejectedProductsCount = products.filter(p => p.status === 'rejected').length;

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Shield size={20}/> <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`admin-nav-item ${active===n.id?'active':''}`} onClick={()=>setActive(n.id)}>
              {n.icon}{n.label}
            </button>
          ))}
        </nav>
        <div className="admin-user-section">
          <div className="admin-user">
            <div className="avatar avatar-sm">{user?.name?.[0]||'A'}</div>
            <div><p className="du-name">{user?.name||'Admin'}</p><p className="du-role">Administrator</p></div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={14}/> <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {/* ── Overview ── */}
        {active==='overview' && (
          <div className="animate-fadeIn">
            <div className="admin-header"><h1>Dashboard</h1><span className="admin-date">{new Date().toLocaleDateString('uz-UZ',{year:'numeric',month:'long',day:'numeric'})}</span></div>
            <div className="metrics-grid">
              {dynamicPlatformMetrics.map(m=>(
                <div key={m.label} className="metric-card">
                  <div className="metric-icon" style={{background:m.color+'20',color:m.color}}>{m.icon}</div>
                  <div className="metric-info">
                    <p className="metric-label">{m.label}</p>
                    <div className="metric-value-row"><strong>{m.value}</strong>{m.unit&&<span>{m.unit}</span>}</div>
                  </div>
                  <span className="metric-delta positive">{m.delta}</span>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Platform daromadi (so'm)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs><linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4822a" stopOpacity={0.3}/><stop offset="95%" stopColor="#d4822a" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)"/>
                    <XAxis dataKey="month" tick={{fontSize:12,fill:'var(--text-muted)'}}/>
                    <YAxis tick={{fontSize:11,fill:'var(--text-muted)'}} tickFormatter={v=>(v/1000000)+'M'}/>
                    <Tooltip formatter={v=>[formatPrice(v),'Daromad']} contentStyle={{background:'var(--bg-primary)',border:'1px solid var(--border-light)',borderRadius:'8px',fontSize:'13px'}}/>
                    <Area type="monotone" dataKey="revenue" stroke="#d4822a" strokeWidth={2} fill="url(#agrad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Kategoriya bo'yicha sotuv</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={dynamicPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                      {dynamicPieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:'var(--bg-primary)',border:'1px solid var(--border-light)',borderRadius:'8px',fontSize:'13px'}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {dynamicPieData.map(d=>(
                    <div key={d.name} className="pie-legend-item">
                      <span className="pie-dot" style={{background:d.color}}/>
                      <span>{d.name}</span><strong>{d.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="admin-alerts">
              {pendingCraftsmenCount > 0 && (
                <div className="alert-item warning"><AlertTriangle size={16}/> {pendingCraftsmenCount} ta yangi hunarmand tasdiqlash kutmoqda</div>
              )}
              {rejectedProductsCount > 0 && (
                <div className="alert-item error"><XCircle size={16}/> {rejectedProductsCount} ta mahsulot rad etilgan / moderatsiyada</div>
              )}
              <div className="alert-item success"><CheckCircle2 size={16}/> Tizim barqaror ishlayapti</div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {active==='users' && (
          <div className="animate-fadeIn">
            <div className="admin-header"><h1>Foydalanuvchilar</h1></div>
            <div className="admin-card">
              <div className="admin-card-toolbar">
                <input
                  className="form-input"
                  placeholder="Ism yoki email bo'yicha qidirish..."
                  style={{maxWidth:280}}
                  value={userSearchQ}
                  onChange={e => setUserSearchQ(e.target.value)}
                />
                <select
                  className="form-input form-select"
                  style={{width:'auto'}}
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value)}
                >
                  <option value="all">Barchasi</option>
                  <option value="customer">Mijoz</option>
                  <option value="craftsman">Hunarmand</option>
                </select>
              </div>
              <table className="table">
                <thead><tr><th>Ism</th><th>Email</th><th>Rol</th><th>Holat</th><th>Qo'shilgan</th><th>Amal</th></tr></thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Foydalanuvchi topilmadi</td></tr>
                  ) : filteredUsers.map(u=>(
                    <tr key={u.id}>
                      <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="avatar avatar-sm">{u.name[0]}</div><strong>{u.name}</strong></div></td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role==='craftsman'?'badge-brand':'badge-info'}`}>{u.role==='craftsman'?'Hunarmand':'Mijoz'}</span></td>
                      <td><span className={`badge ${u.status==='active'?'badge-success':'badge-error'}`}>{u.status==='active'?'Aktiv':'Bloklangan'}</span></td>
                      <td>{u.joined}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-ghost btn-sm" onClick={() => openUserDetail(u)}><Eye size={13}/></button>
                          <button className="btn btn-ghost btn-sm" style={{color: u.status === 'active' ? 'var(--error)' : 'var(--success)'}} onClick={() => handleToggleUserStatus(u.id)}>
                            <XCircle size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {active==='products' && (
          <div className="animate-fadeIn">
            <div className="admin-header"><h1>Mahsulotlar moderatsiyasi</h1></div>
            <div className="admin-card">
              <div className="admin-card-toolbar">
                <input
                  className="form-input"
                  placeholder="Mahsulot nomini qidirish..."
                  style={{maxWidth:280}}
                  value={productSearchQ}
                  onChange={e => setProductSearchQ(e.target.value)}
                />
              </div>
              <table className="table">
                <thead><tr><th>Mahsulot</th><th>Hunarmand</th><th>Narx</th><th>Holat</th><th>Amal</th></tr></thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Mahsulot topilmadi</td></tr>
                  ) : filteredProducts.map(p=>(
                    <tr key={p.id}>
                      <td><div className="product-cell"><img src={p.image} alt={p.title} className="product-cell-img"/>{p.title}</div></td>
                      <td>{p.craftsman?.name || 'Noma\'lum'}</td>
                      <td>{formatPrice(p.price)}</td>
                      <td>
                        <span className={`badge ${p.status === 'rejected' ? 'badge-error' : 'badge-success'}`}>
                          {p.status === 'rejected' ? 'Rad etilgan' : 'Tasdiqlangan'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-ghost btn-sm" onClick={() => handleApproveProduct(p.id)} title="Tasdiqlash"><CheckCircle2 size={13} color="var(--success)"/></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleRejectProduct(p.id)} title="Rad etish"><XCircle size={13} color="var(--error)"/></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteProduct(p.id)} title="O'chirish"><Trash2 size={13} color="var(--error)"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Craftsmen ── */}
        {active==='craftsmen' && (
          <div className="animate-fadeIn">
            <div className="admin-header"><h1>Hunarmandlar</h1></div>
            <div className="admin-card">
              <div className="admin-card-toolbar">
                <input
                  className="form-input"
                  placeholder="Hunarmand yoki viloyatni qidirish..."
                  style={{maxWidth:280}}
                  value={craftsmenSearchQ}
                  onChange={e => setCraftsmenSearchQ(e.target.value)}
                />
              </div>
              <table className="table">
                <thead><tr><th>Ism</th><th>Viloyat</th><th>Mutaxassislik</th><th>Mahsulot</th><th>Reyting</th><th>Holat</th><th>Amal</th></tr></thead>
                <tbody>
                  {filteredCraftsmen.length === 0 ? (
                    <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Usta topilmadi</td></tr>
                  ) : filteredCraftsmen.map(c=>(
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.region}</td>
                      <td>{c.specialty}</td>
                      <td>{c.totalProducts}</td>
                      <td>⭐ {c.rating}</td>
                      <td><span className={`badge ${c.isVerified?'badge-success':'badge-warning'}`}>{c.isVerified?'Tasdiqlangan':'Kutilmoqda'}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-secondary btn-sm" onClick={() => openCraftsmanDetail(c)}>Ko'rish</button>
                          {!c.isVerified && <button className="btn btn-primary btn-sm" onClick={() => handleVerifyCraftsman(c.id)}><CheckCircle2 size={12}/>Tasdiqlash</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {active==='orders' && (
          <div className="animate-fadeIn">
            <div className="admin-header">
              <h1>Buyurtmalar boshqaruvi</h1>
              <span className="dash-count">{filteredOrders.length} ta buyurtma</span>
            </div>
            <div className="admin-card">
              <div className="admin-card-toolbar">
                <input
                  className="form-input"
                  placeholder="Buyurtma yoki mijozni qidirish..."
                  style={{maxWidth:280}}
                  value={orderSearchQ}
                  onChange={e => setOrderSearchQ(e.target.value)}
                />
                <select
                  className="form-input form-select"
                  style={{width:'auto'}}
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">Barcha holatlar</option>
                  {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mijoz</th>
                    <th>Mahsulot</th>
                    <th>Sana</th>
                    <th>Holat</th>
                    <th>Summa</th>
                    <th>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Sorov bo'yicha buyurtma topilmadi</td></tr>
                  ) : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td><strong>{o.customer}</strong></td>
                      <td>{o.product}</td>
                      <td>{o.date}</td>
                      <td>
                        <span className={`status-badge status-${o.status}`}>
                          {ORDER_STATUSES[o.status]?.label || o.status}
                        </span>
                      </td>
                      <td><strong>{formatPrice(o.amount)}</strong></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }}>Ko'rish</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {active==='settings' && (
          <div className="animate-fadeIn">
            <div className="admin-header"><h1>Platform sozlamalari</h1></div>
            <div className="settings-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <form onSubmit={e => handleSaveSettings(e, 'Komissiya sozlamalari')} className="admin-card" style={{padding:24}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Komissiya sozlamalari</h3>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Standart komissiya (%)</label>
                  <input className="form-input" value={settings.commissionStandard} onChange={e => setSettings(prev => ({ ...prev, commissionStandard: e.target.value }))} required />
                </div>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Premium komissiya (%)</label>
                  <input className="form-input" value={settings.commissionPremium} onChange={e => setSettings(prev => ({ ...prev, commissionPremium: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>

              <form onSubmit={e => handleSaveSettings(e, 'Yetkazib berish')} className="admin-card" style={{padding:24}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Yetkazib berish</h3>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Standart narx (so'm)</label>
                  <input className="form-input" value={settings.shippingStandard} onChange={e => setSettings(prev => ({ ...prev, shippingStandard: e.target.value }))} required />
                </div>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Bepul chegara (so'm)</label>
                  <input className="form-input" value={settings.shippingFreeLimit} onChange={e => setSettings(prev => ({ ...prev, shippingFreeLimit: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>

              <form onSubmit={e => handleSaveSettings(e, 'Email sozlamalari')} className="admin-card" style={{padding:24}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Email sozlamalari</h3>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">SMTP server</label>
                  <input className="form-input" value={settings.smtpServer} onChange={e => setSettings(prev => ({ ...prev, smtpServer: e.target.value }))} required />
                </div>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Port</label>
                  <input className="form-input" value={settings.smtpPort} onChange={e => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>

              <form onSubmit={e => handleSaveSettings(e, 'SMS xabarnomalar')} className="admin-card" style={{padding:24}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>SMS xabarnomalar</h3>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Eskiz API key</label>
                  <input className="form-input" type="password" value={settings.smsApiKey} onChange={e => setSettings(prev => ({ ...prev, smsApiKey: e.target.value }))} required />
                </div>
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">Sender nomi</label>
                  <input className="form-input" value={settings.smsSenderName} onChange={e => setSettings(prev => ({ ...prev, smsSenderName: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── Toasts Container ── */}
      <div className="toasts-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={16} color="var(--success)"/>}
            {t.type === 'error' && <AlertTriangle size={16} color="var(--error)"/>}
            {t.type === 'info' && <CheckCircle2 size={16} color="var(--info)"/>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── User Detail Modal ── */}
      {showUserModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Foydalanuvchi ma'lumotlari</h3>
              <button className="admin-modal-close" onClick={() => setShowUserModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar avatar-md" style={{ width: 50, height: 50, fontSize: 20, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', borderRadius:'50%' }}>{selectedUser.name[0]}</div>
                  <div>
                    <strong style={{ fontSize: 16 }}>{selectedUser.name}</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>ID: {selectedUser.id}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rol</span>
                    <p style={{ marginTop: 2 }}><span className={`badge ${selectedUser.role==='craftsman'?'badge-brand':'badge-info'}`}>{selectedUser.role==='craftsman'?'Hunarmand':'Mijoz'}</span></p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Holat</span>
                    <p style={{ marginTop: 2 }}><span className={`badge ${selectedUser.status==='active'?'badge-success':'badge-error'}`}>{selectedUser.status==='active'?'Faol':'Bloklangan'}</span></p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qo'shilgan sana</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedUser.joined}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowUserModal(false)}>Yopish</button>
              <button className={`btn btn-${selectedUser.status === 'active' ? 'error' : 'success'} btn-sm`} onClick={() => { handleToggleUserStatus(selectedUser.id); setShowUserModal(false); }}>
                {selectedUser.status === 'active' ? 'Bloklash' : 'Blokdan chiqarish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Craftsman Detail Modal ── */}
      {showCraftsmanModal && selectedCraftsman && (
        <div className="admin-modal-overlay" onClick={() => setShowCraftsmanModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Hunarmand ma'lumotlari</h3>
              <button className="admin-modal-close" onClick={() => setShowCraftsmanModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{selectedCraftsman.name}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sohasi: {selectedCraftsman.specialty} · Tajribasi: {selectedCraftsman.yearsExp} yil</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bio</span>
                  <p style={{ fontSize: 13, lineHeight: '1.4', marginTop: 4 }}>{selectedCraftsman.bio || "Bio kiritilmagan."}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Viloyat / Shahar</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedCraftsman.region} / {selectedCraftsman.city || selectedCraftsman.region}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aloqa (WhatsApp)</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedCraftsman.whatsapp || "Kiritilmagan"}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mahsulotlar soni</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedCraftsman.totalProducts}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reyting</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>⭐ {selectedCraftsman.rating} ({selectedCraftsman.reviewCount} ta sharh)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCraftsmanModal(false)}>Yopish</button>
              {!selectedCraftsman.isVerified && (
                <button className="btn btn-primary btn-sm" onClick={() => { handleVerifyCraftsman(selectedCraftsman.id); setShowCraftsmanModal(false); }}>
                  Tasdiqlash
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {showOrderModal && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Buyurtma tafsilotlari - {selectedOrder.id}</h3>
              <button className="admin-modal-close" onClick={() => setShowOrderModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
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
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Summa</span>
                    <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--brand-600)' }}>{formatPrice(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joriy Holat</span>
                    <div style={{ marginTop: 4 }}>
                      <span className={`status-badge status-${selectedOrder.status}`}>
                        {ORDER_STATUSES[selectedOrder.status]?.label || selectedOrder.status}
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
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-primary btn-sm" onClick={() => setShowOrderModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
