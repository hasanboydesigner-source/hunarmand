import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

function AppContent() {
  const location = useLocation();
  const isDashboardOrAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {/* Global Components - hidden on admin & dashboard */}
      {!isDashboardOrAdmin && <Header />}
      {!isDashboardOrAdmin && <SearchModal />}
      
      {/* Routing */}
      <div style={{ flex: 1 }}>
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
