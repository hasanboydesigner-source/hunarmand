import { LayoutDashboard, Package, ShoppingBag, Star, MessageCircle, Settings, LogOut, ChevronLeft, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useStore';
import { GiPaintedPottery } from 'react-icons/gi';

const NAV = [
  { id: 'overview',  label: 'Umumiy',      icon: <LayoutDashboard size={16}/> },
  { id: 'products',  label: 'Mahsulotlar', icon: <Package size={16}/> },
  { id: 'orders',    label: 'Buyurtmalar', icon: <ShoppingBag size={16}/> },
  { id: 'reviews',   label: 'Sharhlar',    icon: <Star size={16}/> },
  { id: 'messages',  label: 'Xabarlar',    icon: <MessageCircle size={16}/>, badge: 1 },
  { id: 'settings',  label: 'Sozlamalar',  icon: <Settings size={16}/> },
];

export default function DashboardSidebar({ active, setActive }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="dash-sidebar">
      {/* Brand */}
      <div className="dash-brand">
        <div className="dash-brand-icon">
          <GiPaintedPottery size={18} />
        </div>
        <span>Hunarmand</span>
      </div>

      {/* User card */}
      <div className="dash-user-card">
        <div className="duc-avatar">{initials}</div>
        <div className="duc-info">
          <p className="duc-name">{user?.name || 'Foydalanuvchi'}</p>
          <p className="duc-role">hunarmand</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="dash-nav">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`dash-nav-item ${active === n.id ? 'active' : ''}`}
            onClick={() => setActive(n.id)}
          >
            {n.icon}
            {n.label}
            {n.badge && <span className="dash-nav-badge">{n.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="dash-sidebar-footer">
        <Link to="/" className="dash-back-link">
          <ChevronLeft size={15} /> Bosh sahifaga
        </Link>
        <button className="dash-logout-btn" onClick={handleLogout}>
          <LogOut size={14} /> Tizimdan chiqish
        </button>
      </div>
    </aside>
  );
}
