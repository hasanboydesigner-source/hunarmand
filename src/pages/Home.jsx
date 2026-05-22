import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, MOCK_PRODUCTS, MOCK_CRAFTSMEN, formatPrice } from '../data/constants';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Star, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

const HERO_SLIDES = [
  {
    title: "An'anaviy San'at,\nZamonaviy Bozor",
    subtitle: "O'zbek hunarmandchiligining eng yaxshi namunalarini kashf eting. Har bir buyum — bu qo'l mehnati va sevgining mahsuli.",
    cta: "Mahsulotlarni ko'rish",
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&q=80',
    tag: '🏺 Keramika',
  },
  {
    title: "Buxoroning\nIpak Gilamlari",
    subtitle: "Asrlar davomida avloddan avlodga o'tib kelgan Buxoro gilamchilik san'ati. Har bir gilam o'z tarixiga ega.",
    cta: "Gilamlarni ko'rish",
    ctaLink: '/products?category=gilam',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80',
    tag: '🧶 Gilam',
  },
  {
    title: "Samarqandning\nKumush San'ati",
    subtitle: "Ming yillik zargarlik an'analarini davom ettiruvchi usta qo'llar bilan yaratilgan noyob taqinchoqlar.",
    cta: "Zargarlikni ko'rish",
    ctaLink: '/products?category=zargarlik',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    tag: '💍 Zargarlik',
  },
];

const FEATURES = [
  { icon: <Shield size={22} />, title: 'Haqiqiy buyumlar', desc: "Har bir mahsulot tekshirilgan va sertifikatlangan hunarmand tomonidan yaratilgan." },
  { icon: <Truck size={22} />, title: 'Tez yetkazib berish', desc: "O'zbekiston bo'ylab 1-3 kun ichida yetkazib beramiz." },
  { icon: <CreditCard size={22} />, title: "Xavfsiz to'lov", desc: "Payme, Click, Uzcard, Humo va boshqa to'lov usullari." },
  { icon: <Headphones size={22} />, title: '24/7 yordam', desc: "Istalgan vaqt savollaringizga javob berishga tayyormiz." },
];

const STATS = [
  { end: 2400,  suffix: '+', label: 'Hunarmand',    note: 'Tasdiqlangan usta' },
  { end: 18000, suffix: '+', label: 'Mahsulot',     note: 'Qo\'lda yasalgan' },
  { end: 95000, suffix: '+', label: 'Mamnun mijoz', note: 'Xaridor sharhlari' },
  { end: 13,    suffix: '',  label: 'Viloyat',      note: 'Yetkazib berish' },
];

// Animation variants
const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const sectionStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const featureItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 130, damping: 15 } 
  }
};

const categoryItemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 140, damping: 14 } 
  }
};

const craftsmanItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 15 } 
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25 }
  }
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

function CountUp({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    let timer;
    const duration = 1500;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const startCounting = () => {
      if (started.current) return;
      started.current = true;
      timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    };

    const fallback = setTimeout(() => {
      startCounting();
    }, 1000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          startCounting();
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      if (timer) clearInterval(timer);
    };
  }, [end]);

  const display = count >= 1000
    ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + 'K'
    : count;

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = MOCK_PRODUCTS.filter((p) => p.featured);
  const newest = MOCK_PRODUCTS.filter((p) => p.isNew);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const current = HERO_SLIDES[slide];

  return (
    <div className="home-page page-with-header">
      {/* ── Hero ── */}
      <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <AnimatePresence mode="wait">
          <motion.div 
            className="hero-bg" 
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img src={current.image} alt={current.title} className="hero-bg-img" />
            <div className="hero-bg-overlay" />
          </motion.div>
        </AnimatePresence>

        <div className="container hero-container">
          <div className="hero-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={heroChildVariants} className="hero-tag">{current.tag}</motion.div>
                <motion.h1 variants={heroChildVariants} className="hero-title" style={{ whiteSpace: 'pre-line' }}>
                  {current.title}
                </motion.h1>
                <motion.p variants={heroChildVariants} className="hero-subtitle">{current.subtitle}</motion.p>
                <motion.div variants={heroChildVariants} className="hero-actions">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                    <Link to={current.ctaLink} className="btn btn-primary btn-xl">{current.cta} <ArrowRight size={18} /></Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                    <Link to="/craftsmen" className="btn hero-ghost-btn btn-xl">Hunarmandlar</Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <motion.button 
              key={i} 
              whileHover={{ scale: 1.2 }}
              className={`hero-dot ${i === slide ? 'active' : ''}`} 
              onClick={() => setSlide(i)} 
            />
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="stats-row"
          >
            {STATS.map((s, i) => (
              <motion.div key={i} variants={featureItemVariants} className="stat-item">
                <div className="stat-num">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="stat-lbl">{s.label}</div>
                <div className="stat-note">{s.note}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section section-sm">
        <div className="container">
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="features-grid"
          >
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i} 
                variants={featureItemVariants} 
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="feature-icon"
                >
                  {f.icon}
                </motion.div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <motion.div 
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="section-heading"
          >
            <p className="eyebrow">Browse by craft</p>
            <h2>Hunarmandchilik turlari</h2>
            <p>O'zbek an'anaviy hunarmandchiligining ko'p qirrali dunyosini kashf eting</p>
          </motion.div>
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="categories-grid"
          >
            {CATEGORIES.map((cat) => (
              <motion.div 
                key={cat.id} 
                variants={categoryItemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link to={`/products?category=${cat.id}`} className="category-card">
                  <div className="category-icon" style={{ background: cat.color + '20', color: cat.color }}>
                    <CategoryIcon name={cat.icon} size={24} />
                  </div>
                  <div className="category-info">
                    <h4>{cat.label}</h4>
                    <p>{cat.labelRu}</p>
                  </div>
                  <ChevronRight size={16} className="category-arrow" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', overflow: "hidden" }}>
        <div className="container">
          <motion.div 
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="section-heading"
          >
            <p className="eyebrow">Handpicked</p>
            <h2>Tanlangan mahsulotlar</h2>
            <p>Platformamizning eng mashhur va yuqori baholangan buyumlari</p>
          </motion.div>
          
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="products-grid"
          >
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-footer"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="btn btn-secondary btn-lg">
                Barcha mahsulotlar <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Craftsmen ── */}
      <section className="section">
        <div className="container">
          <motion.div 
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="section-heading"
          >
            <p className="eyebrow">Meet the artisans</p>
            <h2>Mashhur hunarmandlar</h2>
            <p>Platformamizning eng iqtidorli va tajribali ustalari</p>
          </motion.div>
          
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="craftsmen-grid"
          >
            {MOCK_CRAFTSMEN.map((c) => (
              <motion.div 
                key={c.id} 
                variants={craftsmanItemVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link to={`/craftsmen/${c.slug}`} className="craftsman-card">
                  <div className="craftsman-cover">
                    <img src={c.coverImage} alt={c.name} />
                    <div className="craftsman-cover-overlay" />
                    {c.isVerified && <span className="verified-badge">✓ Tasdiqlangan</span>}
                  </div>
                  <div className="craftsman-body">
                    <div className="craftsman-avatar-wrap">
                      <div className="avatar avatar-lg craftsman-avatar">
                        {c.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                    </div>
                    <h3>{c.name}</h3>
                    <div className="craftsman-meta">
                      <span><MapPin size={12} /> {c.region}</span>
                      <span><Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating} ({c.reviewCount})</span>
                    </div>
                    <p className="craftsman-specialty">
                      {CATEGORIES.find(cat => cat.id === c.specialty)?.icon} {CATEGORIES.find(cat => cat.id === c.specialty)?.label}
                    </p>
                    <div className="craftsman-stats-row">
                      <div className="cs-stat"><strong>{c.totalProducts}</strong><span>Mahsulot</span></div>
                      <div className="cs-stat"><strong>{c.totalSales.toLocaleString()}</strong><span>Sotuv</span></div>
                      <div className="cs-stat"><strong>{c.yearsExp}</strong><span>Yil tajriba</span></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-footer"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/craftsmen" className="btn btn-secondary btn-lg">
                Barcha hunarmandlar <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', overflow: "hidden" }}>
        <div className="container">
          <motion.div 
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="section-heading"
          >
            <p className="eyebrow">Just arrived</p>
            <h2>Yangi mahsulotlar</h2>
          </motion.div>
          
          <motion.div 
            variants={sectionStaggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="products-grid"
          >
            {newest.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="cta-card"
          >
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
              className="cta-content"
            >
              <p className="eyebrow" style={{ color: 'var(--brand-300)' }}>Join the platform</p>
              <h2>Hunarmand sifatida ro'yxatdan o'ting</h2>
              <p>O'z buyumlaringizni millionlab xaridorlarga taqdim eting. Ro'yxatdan o'tish bepul!</p>
              <div className="cta-actions">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                  <Link to="/auth/register?role=craftsman" className="btn btn-primary btn-xl">Hunarmand bo'ling</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                  <Link to="/about" className="btn hero-ghost-btn btn-lg">Batafsil bilish</Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
              className="cta-decor"
            >
              <div className="cta-circle c1" />
              <div className="cta-circle c2" />
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="cta-emoji"
              >
                🏺
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
