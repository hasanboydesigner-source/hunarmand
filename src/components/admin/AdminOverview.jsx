import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, ShoppingBag, DollarSign, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../data/constants';

const REVENUE_DATA = [
  {month:'Yan',revenue:0},{month:'Fev',revenue:0},{month:'Mar',revenue:0},
  {month:'Apr',revenue:0},{month:'May',revenue:0},{month:'Iyn',revenue:0},
];

export default function AdminOverview({ users, products, orders, craftsmen }) {
  const totalRev = orders
    .filter(o => o.status === 'delivered' || o.status === 'processing')
    .reduce((sum, o) => sum + o.amount, 0);

  const dynamicPlatformMetrics = [
    { label:'Jami foydalanuvchi', value: String(users.length), icon:<Users size={20}/>,     delta:'', color:'var(--info)' },
    { label:'Faol mahsulotlar',  value: String(products.length), icon:<Package size={20}/>,    delta:'',  color:'var(--brand-500)' },
    { label:"Jami buyurtmalar",  value: String(orders.length), icon:<ShoppingBag size={20}/>,delta:'',color:'var(--success)' },
    { label:'Jami daromad',      value: formatPrice(totalRev), icon:<DollarSign size={20}/>, delta:'', color:'#f59e0b',unit:"" },
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
    <div className="animate-fadeIn">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <span className="admin-date">
          {new Date().toLocaleDateString('uz-UZ',{year:'numeric',month:'long',day:'numeric'})}
        </span>
      </div>
      
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
              <defs>
                <linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4822a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4822a" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
  );
}
