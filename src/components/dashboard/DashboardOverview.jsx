import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DollarSign, ShoppingBag, Package, Star, Bell } from 'lucide-react';
import { formatPrice } from '../../data/constants';

const SALES_DATA = [
  { month: 'Yan', revenue: 1200000, orders: 12 },
  { month: 'Fev', revenue: 1800000, orders: 19 },
  { month: 'Mar', revenue: 1500000, orders: 17 },
  { month: 'Apr', revenue: 2400000, orders: 27 },
  { month: 'May', revenue: 2100000, orders: 26 },
  { month: 'Iyn', revenue: 3200000, orders: 36 },
];

const RECENT_ORDERS = [
  { id: '#HM-19234', product: 'Rishton Keramika Set', customer: 'Zulfiya M.', status: 'processing', amount: 360000 },
  { id: '#HM-19171', product: 'Buxoro Gilamdek',     customer: 'Nodira S.',  status: 'cancelled',  amount: 95000 },
];

const LOW_STOCK = [
  { title: 'Buxoro Ipak Gilam', inStock: 3, image: 'https://uzbekistan.travel/storage/app/media/cropped-images/IMG_6257-0-0-0-0-1593152416.jpg' },
  { title: 'Buxoro Miniatura',  inStock: 2, image: 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg' },
];

const STATUS_COLORS = {
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Jarayonda' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626', label: 'Bekor qilindi' },
  pending:    { bg: '#fef9c3', color: '#854d0e', label: 'Kutilmoqda' },
  delivered:  { bg: '#dcfce7', color: '#15803d', label: 'Yetkazildi' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6', label: 'Yuborildi' },
};

export default function DashboardOverview({ products, orders }) {
  const activeProductsCount = products?.length || 0;
  const activeOrdersCount = orders?.length || 0;
  const totalRevenue = orders
    ?.filter(o => o.status === 'delivered' || o.status === 'processing')
    .reduce((sum, o) => sum + (o.amount || 0), 0) || 360000;

  const METRICS = [
    {
      label: 'JAMI DAROMAD',
      value: formatPrice(totalRevenue),
      unit: '',
      icon: <DollarSign size={18}/>,
      delta: '+18%',
      iconBg: '#dcfce7', iconColor: '#15803d',
    },
    {
      label: 'BUYURTMALAR',
      value: String(activeOrdersCount || 2),
      unit: 'ta',
      icon: <ShoppingBag size={18}/>,
      delta: '+12%',
      iconBg: '#dbeafe', iconColor: '#1e40af',
    },
    {
      label: 'MAHSULOTLAR',
      value: String(activeProductsCount || 1),
      unit: 'ta',
      icon: <Package size={18}/>,
      delta: '+3',
      iconBg: '#fff8f0', iconColor: '#c97a22',
    },
    {
      label: 'REYTING',
      value: '4.9',
      unit: '/5',
      icon: <Star size={18}/>,
      delta: '+0.1',
      iconBg: '#fef9c3', iconColor: '#b45309',
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <p className="dash-page-greeting">Salom, Akbar 👋</p>
          <h1>Boshqaruv paneli</h1>
        </div>
        <button className="dash-notify-btn">
          <Bell size={15}/> Bildirishnomalar
          <span className="dash-notify-count">1</span>
        </button>
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
            <span className="metric-delta positive">↑ {m.delta}</span>
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
            <AreaChart data={SALES_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
            <BarChart data={SALES_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} dx={-5}/>
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
                {(orders?.slice(0,5) || RECENT_ORDERS).map((o, i) => {
                  const st = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={o.id || i}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#888' }}>{o.id}</td>
                      <td style={{ fontWeight: 500 }}>{o.product}</td>
                      <td style={{ color: '#666' }}>{o.customer}</td>
                      <td>
                        <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#111' }}>{formatPrice(o.amount)}</td>
                    </tr>
                  );
                })}
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
            {(products?.filter(p => p.inStock <= 5) || LOW_STOCK).slice(0,5).map((p, i) => (
              <div key={p.id || i} className="low-stock-item">
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
            ))}
            {(products?.filter(p => p.inStock <= 5) || LOW_STOCK).length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                Hamma mahsulotlar yetarli
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
