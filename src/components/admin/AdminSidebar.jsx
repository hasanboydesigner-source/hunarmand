import { Shield, BarChart2, Users, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const NAV = [
  {id:'overview',  label:'Umumiy',        icon:<BarChart2 size={17}/>},
  {id:'users',     label:'Foydalanuvchilar',icon:<Users size={17}/>},
  {id:'products',  label:'Mahsulotlar',   icon:<Package size={17}/>},
  {id:'craftsmen', label:'Hunarmandlar',  icon:<Shield size={17}/>},
  {id:'orders',    label:'Buyurtmalar',   icon:<ShoppingBag size={17}/>},
  {id:'settings',  label:'Sozlamalar',    icon:<Settings size={17}/>},
];

export default function AdminSidebar({ active, setActive }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <Shield size={20}/> <span>Admin Panel</span>
      </div>
      <nav className="admin-nav">
        {NAV.map(n=>(
          <button 
            key={n.id} 
            className={`admin-nav-item ${active===n.id?'active':''}`} 
            onClick={()=>setActive(n.id)}
          >
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
  );
}
