import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '../store/useStore';
import { getInitials } from '../data/constants';
import {
  ShoppingCart, Heart, Search, Menu, X, Sun, Moon,
  User, LogOut, LayoutDashboard, Package, ChevronDown, Bell
} from 'lucide-react';
import { GiPaintedPottery } from 'react-icons/gi';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.items.length);
  const { theme, toggleTheme, openSearch } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/products', label: 'Mahsulotlar' },
    { to: '/craftsmen', label: 'Hunarmandlar' },
    { to: '/categories', label: 'Kategoriyalar' },
    { to: '/about', label: 'Biz haqimizda' },
  ];

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <span>E</span>
          </div>
          <div className="logo-text">
            <span className="logo-primary">E-Hunarmand</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav desktop-only">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link">{l.label}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button className="icon-btn" onClick={openSearch} title="Qidirish" id="search-btn">
            <Search size={20} />
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Tema">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/wishlist" className="icon-btn icon-btn-badge" id="wishlist-btn">
            <Heart size={20} />
            {wishCount > 0 && <span className="badge-dot">{wishCount}</span>}
          </Link>
          <Link to="/cart" className="icon-btn icon-btn-badge" id="cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="profile-dropdown" ref={profileRef}>
              <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)} id="profile-btn">
                <div className="avatar avatar-sm">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar avatar-sm" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <ChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
              </button>
              {profileOpen && (
                <div className="dropdown-menu animate-scaleIn">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-role">{user?.role === 'craftsman' ? 'Hunarmand' : user?.role === 'admin' ? 'Admin' : 'Mijoz'}</p>
                  </div>
                  <div className="dropdown-divider" />
                  {(user?.role === 'craftsman') && (
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard size={15} /> Boshqaruv paneli
                    </Link>
                  )}
                  {(user?.role === 'admin') && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard size={15} /> Admin panel
                    </Link>
                  )}
                  <Link to="/profile/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    <Package size={15} /> Buyurtmalarim
                  </Link>
                  <Link to={user?.role === 'craftsman' ? '/dashboard?tab=settings' : '/profile'} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    <User size={15} /> Profil
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/auth/login" className="btn btn-ghost btn-sm">Kirish</Link>
              <Link to="/auth/register" className="btn btn-primary btn-sm" id="register-btn">Ro'yxat</Link>
            </div>
          )}

          <button className="icon-btn mobile-only" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-slideIn">
          <nav className="mobile-nav">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/auth/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Kirish</Link>
              <Link to="/auth/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Ro'yxat</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
