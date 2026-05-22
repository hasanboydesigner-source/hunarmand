import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ScrollToTop from './components/ScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';

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

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 110,
      damping: 15,
      mass: 0.8
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: "100%", display: "flex", flexDirection: "column", flex: 1 }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardOrAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {/* Global Components - hidden on admin & dashboard */}
      {!isDashboardOrAdmin && <Header />}
      {!isDashboardOrAdmin && <SearchModal />}
      
      {/* Routing with Page Transitions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/products" element={<AnimatedPage><ProductsPage /></AnimatedPage>} />
            <Route path="/products/:id" element={<AnimatedPage><ProductDetailPage /></AnimatedPage>} />
            <Route path="/craftsmen" element={<AnimatedPage><CraftsmenList /></AnimatedPage>} />
            <Route path="/craftsmen/:slug" element={<AnimatedPage><CraftsmanProfilePage /></AnimatedPage>} />
            <Route path="/categories" element={<AnimatedPage><CategoriesPage /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
            <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
            <Route path="/wishlist" element={<AnimatedPage><WishlistPage /></AnimatedPage>} />
            <Route path="/auth/login" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
            <Route path="/auth/register" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
            <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
            <Route path="/admin" element={<AnimatedPage><AdminPage /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
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
