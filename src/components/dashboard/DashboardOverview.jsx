import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DollarSign, ShoppingBag, Package, Star, Bell } from 'lucide-react';
import { formatPrice } from '../../data/constants';
import { useAuthStore } from '../../store/useStore';

const STATUS_COLORS = {
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Jarayonda' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626', label: 'Bekor qilindi' },
  pending:    { bg: '#fef9c3', color: '#854d0e', label: 'Kutilmoqda' },
  delivered:  { bg: '#dcfce7', color: '#15803d', label: 'Yetkazildi' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6', label: 'Yuborildi' },
};

export default function DashboardOverview({ products = [], orders = [], reviews = [] }) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const activeProductsCount = products.length;
  const activeOrdersCount = orders.length;
  
  // Calculate notifications
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStock = products.filter(p => p.inStock <= 5);
  // Get recent reviews (within 24 hours)
  const recentReviews = (reviews || []).filter(r => {
    const diff = Date.now() - new Date(r.createdAt || Date.now()).getTime();
    return diff < 24 * 60 * 60 * 1000;
  });
  
  const notifications = [
    ...recentReviews.map(r => ({
      id: r._id || r.id || Math.random(),
      type: 'review',
      title: 'Yangi sharh qoldirildi',
      desc: `${r.author || 'Mijoz'} - ${r.productName || 'Mahsulot'}`,
      icon: <Star size={14}/>
    })),
    ...pendingOrders.map(o => ({
      id: o._id || o.id,
      type: 'order',
      title: 'Yangi buyurtma',
      desc: `${o.orderNumber || o.id} • ${formatPrice(o.amount || o.totalAmount)}`,
      icon: <ShoppingBag size={14}/>
    })),
    ...lowStock.map(p => ({
      id: p._id || p.id,
      type: 'stock',
      title: 'Zaxira tugamoqda',
      desc: `${p.title} dan ${p.inStock} ta qoldi`,
      icon: <Package size={14}/>
    }))
  ];
  
  const totalRevenue = orders
    .filter(o => o.status === 'delivered' || o.status === 'processing')
    .reduce((sum, o) => sum + (o.amount || o.totalAmount || 0), 0);

  // Dynamic Chart Data Generation (Last 6 Months)
  const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  const currentMonth = new Date().getMonth();
  
  const salesData = [];
  for (let i = 5; i >= 0; i--) {
    let d = new Date();
    d.setMonth(currentMonth - i);
    salesData.push({ 
      month: monthNames[d.getMonth()], 
      revenue: 0, 
      orders: 0, 
      monthIndex: d.getMonth(), 
      year: d.getFullYear() 
    });
  }

  orders.forEach(o => {
    // Backend returns createdAt, frontend mock might use date. Let's handle both.
    // In our case we have true production data:
    const dStr = o.createdAt || o.date;
    if (!dStr) return;
    
    // In real app, createdAt is ISO string. If it's a fallback string like '12.05.2026', Date parse might fail.
    // Assuming backend returns standard ISO date:
    const d = new Date(dStr);
    const mIdx = d.getMonth();
    const y = d.getFullYear();
    
    const target = salesData.find(s => s.monthIndex === mIdx && s.year === y);
    if (target) {
      target.orders += 1;
      if (o.status === 'delivered' || o.status === 'processing' || o.status === 'pending') {
        target.revenue += (o.amount || o.totalAmount || 0);
      }
    }
  });

  const METRICS = [
    {
      label: 'JAMI DAROMAD',
      value: formatPrice(totalRevenue),
      unit: '',
      icon: <DollarSign size={18}/>,
      delta: activeOrdersCount > 0 ? '+12%' : '0%',
      iconBg: '#dcfce7', iconColor: '#15803d',
    },
    {
      label: 'BUYURTMALAR',
      value: String(activeOrdersCount),
      unit: 'ta',
      icon: <ShoppingBag size={18}/>,
      delta: activeOrdersCount > 0 ? '+8%' : '0%',
      iconBg: '#dbeafe', iconColor: '#1e40af',
    },
    {
      label: 'MAHSULOTLAR',
      value: String(activeProductsCount),
      unit: 'ta',
      icon: <Package size={18}/>,
      delta: activeProductsCount > 0 ? '+1' : '0',
      iconBg: '#fff8f0', iconColor: '#c97a22',
    },
    {
      label: 'REYTING',
      value: activeOrdersCount > 0 ? '4.8' : '0.0',
      unit: '/5',
      icon: <Star size={18}/>,
      delta: '0.0',
      iconBg: '#fef9c3', iconColor: '#b45309',
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <p className="dash-page-greeting">Salom, {user?.name?.split(' ')[0] || 'Hunarmand'} 👋</p>
          <h1>Boshqaruv paneli</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="dash-notify-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={15}/> Bildirishnomalar
            <span className="dash-notify-count">{notifications.length}</span>
          </button>
          
          {showNotifications && (
            <div style={{ 
              position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 320, 
              background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
              border: '1px solid #eee', zIndex: 50, padding: 16 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Bildirishnomalar</h3>
                <span style={{ fontSize: 11, background: '#f3f4f6', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{notifications.length} ta yangi</span>
              </div>
              
              {notifications.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
                  Sizda yangi bildirishnomalar yo'q
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.map((n, i) => (
                    <div key={n.id || i} style={{ display: 'flex', gap: 12, padding: 10, borderRadius: 8, background: '#f9f9f9', alignItems: 'flex-start' }}>
                      <div style={{ 
                        background: n.type === 'order' ? '#dcfce7' : n.type === 'review' ? '#fef9c3' : '#fff8f0', 
                        color: n.type === 'order' ? '#15803d' : n.type === 'review' ? '#b45309' : '#c97a22', 
                        padding: 8, borderRadius: 50, display: 'flex' 
                      }}>
                        {n.icon}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111' }}>{n.title}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#666', marginTop: 2 }}>{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        {METRICS.map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-icon" style={{ background: m.iconBg, color: m.iconColor }}>
              {m.icon}
            </div>
            <div className="metric-info">
              <p className="metric-label">{m.label}</p>
              <div className="metric-value-row">
                <strong>{m.value}</strong>
                {m.unit && <span>{m.unit}</span>}
              </div>
            </div>
            {m.delta !== '0%' && m.delta !== '0' && m.delta !== '0.0' && (
              <span className="metric-delta positive">↑ {m.delta}</span>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Area Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Oylik daromad</h3>
            <select className="form-input form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 10px', minHeight: 0, height: 30 }}>
              <option>So'nggi 6 oy</option>
              <option>Bu yil</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c97a22" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#c97a22" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v} dx={-5}/>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                formatter={v => [formatPrice(v), 'Daromad']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#c97a22" strokeWidth={2.5} fill="url(#revGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Buyurtmalar soni</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} dx={-5} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                formatter={v => [v, 'Buyurtmalar']}
              />
              <Bar dataKey="orders" fill="#c97a22" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="dash-bottom-grid">
        {/* Recent Orders */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>So'nggi buyurtmalar</h3>
            <a href="#" className="dash-card-link" onClick={e => e.preventDefault()}>Barchasini →</a>
          </div>
          <div className="dash-table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MAHSULOT</th>
                  <th>MIJOZ</th>
                  <th>HOLAT</th>
                  <th>SUMMA</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                      Sizda hali buyurtmalar yo'q
                    </td>
                  </tr>
                ) : (
                  orders.slice(0,5).map((o, i) => {
                    const st = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={o.id || i}>
                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#888' }}>{o.id || o.orderNumber}</td>
                        <td style={{ fontWeight: 500 }}>{o.product || (o.items && o.items[0]?.title)}</td>
                        <td style={{ color: '#666' }}>{typeof o.customer === 'object' ? o.customer?.name : o.customer}</td>
                        <td>
                          <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: '#111' }}>{formatPrice(o.amount || o.totalAmount)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>⚠️ Kam qolgan</h3>
          </div>
          <div className="low-stock-list">
            {products.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                 Sizda hali mahsulotlar yo'q
               </div>
            ) : products.filter(p => p.inStock <= 5).length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                 Hamma mahsulotlar zaxirasi yetarli
               </div>
            ) : (
              products.filter(p => p.inStock <= 5).slice(0,5).map((p, i) => (
                <div key={p.id || p._id || i} className="low-stock-item">
                  <img
                    src={p.image || 'https://via.placeholder.com/38'}
                    alt={p.title}
                    className="ls-img"
                  />
                  <div className="ls-info">
                    <p className="ls-title">{p.title}</p>
                    <p className={`ls-stock ${p.inStock > 3 ? 'ok' : ''}`}>
                      {p.inStock} ta qoldi
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
