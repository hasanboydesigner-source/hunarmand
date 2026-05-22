import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BounceLoader } from 'react-spinners';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import CraftsmenList from './pages/CraftsmenList';
import CraftsmanProfilePage from './pages/CraftsmanProfile';
import CategoriesPage from './pages/Categories';
import AboutPage from './pages/About';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import WishlistPage from './pages/Wishlist';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import AdminPage from './pages/Admin';

function GlobalLoader({ isLoading }) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 600); // Wait for fade out animation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`global-loader ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <BounceLoader color="#d4822a" size={56} speedMultiplier={1.5} />
        <div className="loader-logo-wrap">
          <span style={{ fontFamily: 'Italiana, serif', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>E-Hunarmand</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase' }}>Milliy Meros</span>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardOrAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Simulate initial loading time for aesthetics
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlobalLoader isLoading={isAppLoading} />
      <ScrollToTop />
      {/* Global Components - hidden on admin & dashboard */}
      {!isDashboardOrAdmin && <Header />}
      {!isDashboardOrAdmin && <SearchModal />}
      
      {/* Routing */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/craftsmen" element={<CraftsmenList />} />
          <Route path="/craftsmen/:slug" element={<CraftsmanProfilePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {!isDashboardOrAdmin && <Footer />}
      <Toaster position="bottom-right" toastOptions={{ className: 'react-hot-toast-custom' }} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
