import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store/useStore';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const { user } = useAuthStore();
  const cartItems = useCartStore(state => state.items) || [];
  const location = useLocation();

  // If user is not logged in or is on dashboard/admin, hide the nav
  if (!user || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
    return null;
  }

  const cartItemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="mobile-bottom-nav">
      <div className="bottom-nav-container">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} />
          <span>Asosiy</span>
        </NavLink>
        
        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={22} />
          <span>Qidiruv</span>
        </NavLink>
        
        <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon-badge-wrap">
            <ShoppingCart size={22} />
            {cartItemCount > 0 && <span className="nav-badge">{cartItemCount}</span>}
          </div>
          <span>Savatcha</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} />
          <span>Profil</span>
        </NavLink>
      </div>
    </div>
  );
}
