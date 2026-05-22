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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              {PLATFORM_METRICS.map(m=>(
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
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                      {PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:'var(--bg-primary)',border:'1px solid var(--border-light)',borderRadius:'8px',fontSize:'13px'}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {PIE_DATA.map(d=>(
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
              <div className="alert-item warning"><AlertTriangle size={16}/> 3 ta yangi hunarmand tasdiqlash kutmoqda</div>
              <div className="alert-item error"><XCircle size={16}/> 2 ta mahsulot shikoyat olgan — moderatsiya kerak</div>
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
                <input className="form-input" placeholder="Qidirish..." style={{maxWidth:280}}/>
                <select className="form-input form-select" style={{width:'auto'}}>
                  <option>Barchasi</option><option>Mijoz</option><option>Hunarmand</option>
                </select>
              </div>
              <table className="table">
                <thead><tr><th>Ism</th><th>Email</th><th>Rol</th><th>Holat</th><th>Qo'shilgan</th><th>Amal</th></tr></thead>
                <tbody>
                  {MOCK_USERS.map(u=>(
                    <tr key={u.id}>
                      <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="avatar avatar-sm">{u.name[0]}</div><strong>{u.name}</strong></div></td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role==='craftsman'?'badge-brand':'badge-info'}`}>{u.role==='craftsman'?'Hunarmand':'Mijoz'}</span></td>
                      <td><span className={`badge ${u.status==='active'?'badge-success':'badge-error'}`}>{u.status==='active'?'Aktiv':'Bloklangan'}</span></td>
                      <td>{u.joined}</td>
                      <td><div className="action-btns"><button className="btn btn-ghost btn-sm"><Eye size={13}/></button><button className="btn btn-ghost btn-sm" style={{color:'var(--error)'}}><XCircle size={13}/></button></div></td>
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
              <table className="table">
                <thead><tr><th>Mahsulot</th><th>Hunarmand</th><th>Narx</th><th>Holat</th><th>Amal</th></tr></thead>
                <tbody>
                  {MOCK_PRODUCTS.map(p=>(
                    <tr key={p.id}>
                      <td><div className="product-cell"><img src={p.image} alt={p.title} className="product-cell-img"/>{p.title}</div></td>
                      <td>{p.craftsman?.name}</td>
                      <td>{formatPrice(p.price)}</td>
                      <td><span className="badge badge-success">Tasdiqlangan</span></td>
                      <td><div className="action-btns"><button className="btn btn-ghost btn-sm"><CheckCircle2 size={13} color="var(--success)"/></button><button className="btn btn-ghost btn-sm"><XCircle size={13} color="var(--error)"/></button><button className="btn btn-ghost btn-sm"><Trash2 size={13} color="var(--error)"/></button></div></td>
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
              <table className="table">
                <thead><tr><th>Ism</th><th>Viloyat</th><th>Mutaxassislik</th><th>Mahsulot</th><th>Reyting</th><th>Holat</th><th>Amal</th></tr></thead>
                <tbody>
                  {MOCK_CRAFTSMEN.map(c=>(
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.region}</td>
                      <td>{c.specialty}</td>
                      <td>{c.totalProducts}</td>
                      <td>⭐ {c.rating}</td>
                      <td><span className={`badge ${c.isVerified?'badge-success':'badge-warning'}`}>{c.isVerified?'Tasdiqlangan':'Kutilmoqda'}</span></td>
                      <td><div className="action-btns"><button className="btn btn-secondary btn-sm">Ko'rish</button>{!c.isVerified&&<button className="btn btn-primary btn-sm"><CheckCircle2 size={12}/>Tasdiqlash</button>}</div></td>
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
              {[
                {title:'Komissiya sozlamalari', fields:[{label:"Standart komissiya (%)",val:"8"},{label:"Premium komissiya (%)",val:"5"}]},
                {title:'Yetkazib berish',        fields:[{label:"Standart narx (so'm)",val:"30000"},{label:"Bepul chegara (so'm)",val:"500000"}]},
                {title:'Email sozlamalari',      fields:[{label:"SMTP server",val:"smtp.gmail.com"},{label:"Port",val:"587"}]},
                {title:'SMS xabarnomalar',       fields:[{label:"Eskiz API key",val:"****"},{label:"Sender nomi",val:"HUNARMAND"}]},
              ].map(s=>(
                <div key={s.title} className="admin-card" style={{padding:24}}>
                  <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>{s.title}</h3>
                  {s.fields.map(f=>(
                    <div key={f.label} className="form-group" style={{marginBottom:12}}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-input" defaultValue={f.val}/>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm">Saqlash</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
