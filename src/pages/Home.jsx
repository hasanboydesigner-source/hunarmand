import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { CATEGORIES, MOCK_PRODUCTS, MOCK_CRAFTSMEN, API_URL } from '../data/constants';
import { useUIStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Star, MapPin, ChevronRight } from 'lucide-react';
import { HeroSkeleton, FeatureCardSkeleton, CategoryCardSkeleton, ProductCardSkeleton } from '../components/Skeletons';
import { useTranslation } from 'react-i18next';
import './Home.css';
import axios from 'axios';



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
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const setProductsLoaded = useUIStore((s) => s.setProductsLoaded);

  const HERO_SLIDES = [
    {
      title: t('home.hero1_title'),
      subtitle: t('home.hero1_sub'),
      cta: t('home.hero_cta1'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&q=80',
      tag: '🏺 ' + t('home.cat_ceramic'),
    },
    {
      title: t('home.hero2_title'),
      subtitle: t('home.hero2_sub'),
      cta: t('home.hero_cta2'),
      ctaLink: '/products?category=gilam',
      image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80',
      tag: '🧶 ' + t('home.cat_carpet'),
    },
    {
      title: t('home.hero3_title'),
      subtitle: t('home.hero3_sub'),
      cta: t('home.hero_cta3'),
      ctaLink: '/products?category=zargarlik',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
      tag: '💍 ' + t('home.cat_jewelry'),
    },
  ];

  const FEATURES = [
    { icon: <Shield size={22} />, title: t('home.feat1_title'), desc: t('home.feat1_desc') },
    { icon: <Truck size={22} />, title: t('home.feat2_title'), desc: t('home.feat2_desc') },
    { icon: <CreditCard size={22} />, title: t('home.feat3_title'), desc: t('home.feat3_desc') },
    { icon: <Headphones size={22} />, title: t('home.feat4_title'), desc: t('home.feat4_desc') },
  ];

  const STATS = [
    { end: 2400,  suffix: '+', label: t('nav.craftsmen'),    note: t('home.stat1_note') },
    { end: 18000, suffix: '+', label: t('nav.products'),     note: t('home.stat2_note') },
    { end: 95000, suffix: '+', label: t('home.stat3_lbl'), note: t('home.stat3_note') },
    { end: 13,    suffix: '',  label: t('home.stat4_lbl'),      note: t('home.stat4_note') },
  ];

  const enrichProductWithCraftsman = (pData) => {
    if (!pData) return pData;
    const c = pData.craftsman;
    if (!c) return pData;

    const name = typeof c === 'object' ? c.name : '';
    const specialty = pData.category || '';
    
    const mockC = MOCK_CRAFTSMEN?.find(mc => 
      mc.name?.toLowerCase() === name.toLowerCase() ||
      (specialty && mc.specialty?.toLowerCase() === specialty.toLowerCase())
    );

    const coverImageFallback = specialty === 'keramika'
      ? 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg'
      : specialty === 'gilam'
      ? 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg'
      : specialty === 'zargarlik'
      ? 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp'
      : specialty === 'yogoch'
      ? 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg'
      : specialty === 'toʻqimachilik' || specialty === 'to\'qimachilik'
      ? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
      : specialty === 'naqqoshlik'
      ? 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg'
      : specialty === 'misgarlik'
      ? 'https://api.society.uz/media/news/BQ8A4028.webp'
      : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80';

    const enrichedCraftsman = typeof c === 'object' ? {
      ...c,
      coverImage: c.coverImage || mockC?.coverImage || coverImageFallback,
      rating: c.rating || mockC?.rating || 4.8,
      reviewCount: c.reviewCount || mockC?.reviewCount || 15,
      totalSales: c.totalSales || mockC?.totalSales || 24,
      yearsExp: c.yearsExp || mockC?.yearsExp || 5,
      responseTime: c.responseTime || mockC?.responseTime || '< 2 soat',
      totalProducts: c.totalProducts || mockC?.totalProducts || 8,
    } : c;

    return {
      ...pData,
      rating: pData.rating || mockC?.rating || 5,
      reviewCount: pData.reviewCount || mockC?.reviewCount || 12,
      craftsman: enrichedCraftsman
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, craftsmenRes] = await Promise.all([
          axios.get(`${API_URL}/products`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/auth/craftsmen`).catch(() => ({ data: [] }))
        ]);
        
        const productsData = productsRes.data || [];
        const craftsmenData = craftsmenRes.data || [];
        
        setCraftsmen(craftsmenData.slice(0, 4));
        
        const enriched = productsData.map(p => enrichProductWithCraftsman(p));
        setAllProducts(enriched);
      } catch (err) {
        console.error("API error fetching data in Home:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setProductsLoaded(true);
        }, 500); // small delay for skeletons
      }
    };
    fetchData();
  }, []);

  const featured = allProducts.filter((p) => p.featured || p.rating > 4.5).slice(0, 4);
  const newest = [...allProducts].reverse().slice(0, 4);

  if (isLoading) {
    return (
      <div className="home-page page-with-header">
        {/* Hero Slide Skeleton - FULL WIDTH */}
        <section className="hero" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container hero-container">
            <HeroSkeleton />
          </div>
        </section>
        
        <div className="container" style={{ paddingBlock: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Features Skeleton */}
          <div className="features-grid">
            {[1, 2, 3, 4].map((i) => (
              <FeatureCardSkeleton key={i} />
            ))}
          </div>

          {/* Categories Section Heading Skeleton */}
          <div className="section-heading" style={{ marginBottom: '24px' }}>
            <div style={{ width: '120px', height: '12px', background: 'var(--bg-tertiary)', borderRadius: '4px', margin: '0 auto 10px' }} />
            <div style={{ width: '280px', height: '32px', background: 'var(--bg-tertiary)', borderRadius: '8px', margin: '0 auto' }} />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="categories-grid">
            {[1, 2, 3, 4].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>

          {/* Featured Products Heading Skeleton */}
          <div className="section-heading" style={{ marginBottom: '24px', marginTop: '20px' }}>
            <div style={{ width: '100px', height: '12px', background: 'var(--bg-tertiary)', borderRadius: '4px', margin: '0 auto 10px' }} />
            <div style={{ width: '260px', height: '32px', background: 'var(--bg-tertiary)', borderRadius: '8px', margin: '0 auto' }} />
          </div>

          {/* Product Grid Skeleton */}
          <div className="products-grid">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page page-with-header">
      {/* ── Hero ── */}
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.hero-dots', bulletClass: 'hero-dot', bulletActiveClass: 'active' }}
          loop={true}
          className="hero-swiper"
        >
          {HERO_SLIDES.map((slideItem, index) => (
            <SwiperSlide key={index}>
              <div className="hero-bg">
                <img src={slideItem.image} alt={slideItem.title} className="hero-bg-img" />
                <div className="hero-bg-overlay" />
              </div>
              <div className="container hero-container">
                <div className="hero-content">
                  <div className="hero-tag">{slideItem.tag}</div>
                  <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
                    {slideItem.title}
                  </h1>
                  <p className="hero-subtitle">{slideItem.subtitle}</p>
                  <div className="hero-actions">
                    <Link to={slideItem.ctaLink} className="btn btn-primary btn-xl">{slideItem.cta} <ArrowRight size={18} /></Link>
                    <Link to="/craftsmen" className="btn hero-ghost-btn btn-xl">{t('nav.craftsmen')}</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="hero-dots"></div>
        </Swiper>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-row" data-aos="fade-up">
            {STATS.map((s, i) => (
              <div 
                key={i} 
                className="stat-item"
              >
                <div className="stat-num">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="stat-lbl">{s.label}</div>
                <div className="stat-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section section-sm">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div 
                key={i} 
                className="feature-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-heading" data-aos="fade-up">
            <p className="eyebrow">{t('home.cat_eyebrow')}</p>
            <h2>{t('home.cat_title')}</h2>
            <p>{t('home.cat_desc')}</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${cat.id}`} 
                className="category-card"
                data-aos="zoom-in"
                data-aos-delay={i * 50}
              >
                <div className="category-icon" style={{ background: cat.color + '20', color: cat.color }}>
                  <CategoryIcon name={cat.icon} size={24} />
                </div>
                <div className="category-info">
                  <h4>{i18n.language === 'ru' ? cat.labelRu : i18n.language === 'en' ? (cat.labelEn || cat.label) : cat.label}</h4>
                  <p>{cat.desc || ''}</p>
                </div>
                <ChevronRight size={16} className="category-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', overflow: "hidden" }}>
        <div className="container">
          <div className="section-heading" data-aos="fade-up">
            <p className="eyebrow">{t('home.feat_prod_eyebrow')}</p>
            <h2>{t('home.feat_prod_title')}</h2>
            <p>{t('home.feat_prod_desc')}</p>
          </div>
          
          <div className="products-grid" data-aos="fade-up" data-aos-delay="100">
            {featured.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
          </div>

          <div className="section-footer">
            <Link to="/products" className="btn btn-secondary btn-lg">
              {t('home.all_products')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Craftsmen ── */}
      <section className="section">
        <div className="container">
          <div className="section-heading" data-aos="fade-up">
            <p className="eyebrow">{t('home.crafts_eyebrow')}</p>
            <h2>{t('home.crafts_title')}</h2>
            <p>{t('home.crafts_desc')}</p>
          </div>
          
          <div className="craftsmen-grid" data-aos="fade-up" data-aos-delay="100">
            {craftsmen.map((c) => {
              const coverImageFallback = c.specialty === 'keramika'
                ? 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg'
                : c.specialty === 'gilam'
                ? 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg'
                : c.specialty === 'zargarlik'
                ? 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp'
                : c.specialty === 'yogoch'
                ? 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg'
                : c.specialty === 'toʻqimachilik' || c.specialty === 'to\'qimachilik'
                ? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
                : c.specialty === 'naqqoshlik'
                ? 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg'
                : c.specialty === 'misgarlik'
                ? 'https://api.society.uz/media/news/BQ8A4028.webp'
                : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80';

              const theirProducts = allProducts.filter(p => {
                const cid = typeof p.craftsman === 'object' ? p.craftsman?._id : p.craftsman;
                return cid === c._id || cid === c.id || (typeof p.craftsman === 'object' && p.craftsman?.name === c.name);
              });
              
              const theirProduct = theirProducts[0];
              const totalProducts = theirProducts.length;
              const totalSales = theirProducts.reduce((acc, p) => acc + (p.sold || 0), 0);
              
              const finalCover = theirProduct?.image || c.coverImage || coverImageFallback;
              
              return (
              <Link 
                key={c._id || c.id} 
                to={`/craftsmen/${c.slug || c._id || c.id}`} 
                className="craftsman-card"
              >
                <div className="craftsman-cover">
                  <img src={finalCover} alt={c.name} />
                  <div className="craftsman-cover-overlay" />
                  {c.isVerified && <span className="verified-badge">✓ {t('home.verified')}</span>}
                </div>
                <div className="craftsman-body">
                  <div className="craftsman-avatar-wrap">
                    <div className="avatar avatar-lg craftsman-avatar">
                      {(c.shopName || c.name).split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                  </div>
                  <h3>{c.shopName || c.name}</h3>
                  <div className="craftsman-meta">
                    <span><MapPin size={12} /> {c.region}</span>
                    <span><Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating || 4.8} ({c.reviewCount || 15})</span>
                  </div>
                  <p className="craftsman-specialty">
                    {CATEGORIES.find(cat => cat.id === c.specialty)?.icon} {CATEGORIES.find(cat => cat.id === c.specialty)?.label}
                  </p>
                  <div className="craftsman-stats-row">
                    <div className="cs-stat"><strong>{totalProducts}</strong><span>{t('nav.products')}</span></div>
                    <div className="cs-stat"><strong>{totalSales.toLocaleString()}</strong><span>{t('home.sales')}</span></div>
                    <div className="cs-stat"><strong>{c.yearsExp || 0}</strong><span>{t('home.years_exp')}</span></div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
          
          <div className="section-footer">
            <Link to="/craftsmen" className="btn btn-secondary btn-lg">
              {t('home.all_craftsmen')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', overflow: "hidden" }}>
        <div className="container">
          <div className="section-heading" data-aos="fade-up">
            <p className="eyebrow">{t('home.new_eyebrow')}</p>
            <h2>{t('home.new_title')}</h2>
          </div>
          
          <div className="products-grid" data-aos="fade-up" data-aos-delay="100">
            {newest.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card" data-aos="zoom-in-up">
            <div className="cta-content">
              <p className="eyebrow" style={{ color: 'var(--brand-300)' }}>{t('home.cta_eyebrow')}</p>
              <h2>{t('home.cta_title')}</h2>
              <p>{t('home.cta_desc')}</p>
              <div className="cta-actions">
                <Link to="/auth/register?role=craftsman" className="btn btn-primary btn-xl">{t('footer.become_craftsman')}</Link>
                <Link to="/about" className="btn hero-ghost-btn btn-lg">{t('home.learn_more')}</Link>
              </div>
            </div>
            <div className="cta-decor">
              <div className="cta-circle c1" />
              <div className="cta-circle c2" />
              <div className="cta-emoji">🏺</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
