import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BounceLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ScrollToTop from './components/ScrollToTop';
import OnboardingTour from './components/OnboardingTour';
import Chatbot from './components/Chatbot';
import MobileBottomNav from './components/MobileBottomNav';
import { useAuthStore } from './store/useStore';

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
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';
import CustomerProfilePage from './pages/CustomerProfile';
import CertificateVerify from './pages/CertificateVerify';

/* ─── Route Guards ───────────────────────────────────────────── */
function ProtectedRoute({ children, redirect = '/auth/login' }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={`${redirect}?redirect=${location.pathname}`} replace />;
  }
  return children;
}

function RoleRoute({ children, role, redirect = '/' }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  const hasRole = Array.isArray(role) ? role.includes(user?.role) : user?.role === role;
  if (!hasRole) return <Navigate to={redirect} replace />;
  return children;
}

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
  const { user } = useAuthStore();

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
    <div className={`app-container ${user && !isDashboardOrAdmin ? 'has-bottom-nav' : ''}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlobalLoader isLoading={isAppLoading} />
      <ScrollToTop />
      {!isDashboardOrAdmin && <OnboardingTour />}
      {/* Global Components - hidden on admin & dashboard */}
      {!isDashboardOrAdmin && <Header />}
      {!isDashboardOrAdmin && <SearchModal />}
      
      {/* Routing */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/craftsmen" element={<CraftsmenList />} />
          <Route path="/craftsmen/:slug" element={<CraftsmanProfilePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/verify/:id" element={<CertificateVerify />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected: login kerak */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
          <Route path="/profile/orders" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
          <Route path="/profile/messages" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />

          {/* Role protected: faqat hunarmand */}
          {/* Role protected: hunarmand va admin uchun */}
          <Route path="/dashboard" element={<RoleRoute role={['craftsman', 'admin']} redirect="/"><DashboardPage /></RoleRoute>} />

          {/* Role protected: faqat admin */}
          <Route path="/admin" element={<RoleRoute role="admin" redirect="/"><AdminPage /></RoleRoute>} />
        </Routes>
      </div>

      {!isDashboardOrAdmin && <Footer />}
      <Chatbot />
      <MobileBottomNav />
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
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
