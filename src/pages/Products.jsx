import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES, REGIONS, SORT_OPTIONS, formatPrice, MOCK_CRAFTSMEN, API_URL } from '../data/constants';
import { useUIStore } from '../store/useStore';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { ProductCardSkeleton } from '../components/Skeletons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Products.css';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const setProductsLoaded = useUIStore((s) => s.setProductsLoaded);

  const category = params.get('category') || '';
  const region = params.get('region') || '';
  const sort = params.get('sort') || 'newest';
  const q = params.get('q') || '';
  const minPrice = Number(params.get('minPrice') || 0);
  const maxPrice = Number(params.get('maxPrice') || 150000000);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const [allProducts, setAllProducts] = useState([]);
  
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
      : specialty === 'to\'qimachilik' || specialty === 'to\'qimachilik'
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
    setIsLoading(true);
    axios.get(`${API_URL}/products`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          const enriched = res.data.map(p => enrichProductWithCraftsman(p));
          setAllProducts(enriched);
        } else {
          setAllProducts(MOCK_PRODUCTS);
        }
      })
      .catch(err => {
        console.error("API xatosi, qalbaki ma'lumotlar ishlatilmoqda:", err);
        setAllProducts(MOCK_PRODUCTS);
      })
      .finally(() => {
        setIsLoading(false);
        setProductsLoaded(true);
      });
  }, []);

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next);
  };

  const clearAll = () => setParams({});

  const handleViewChange = (newView) => {
    if (newView === view) return;
    setView(newView);
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (q) list = list.filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.craftsman?.name?.toLowerCase().includes(q.toLowerCase())
    );
    if (category) {
      list = list.filter(p => {
        const pCat = p.category?.toLowerCase() || '';
        const targetCat = category.toLowerCase();
        
        // Find if pCat matches a label, and if so, use its ID
        const matchedCategory = CATEGORIES.find(c => 
          c.id === pCat || c.label.toLowerCase() === pCat
        );
        
        const normalizedPCat = matchedCategory ? matchedCategory.id : pCat;
        return normalizedPCat === targetCat;
      });
    }
    if (region) list = list.filter(p => p.craftsman?.region === region);
    list = list.filter(p => {
      const pPrice = Number(p.price) || 0;
      return pPrice >= minPrice && pPrice <= maxPrice;
    });
    switch (sort) {
      case 'price_asc': list.sort((a,b) => a.price - b.price); break;
      case 'price_desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating': list.sort((a,b) => b.rating - a.rating); break;
      case 'popular': list.sort((a,b) => b.sold - a.sold); break;
      default: list.sort((a,b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [allProducts, q, category, region, sort, minPrice, maxPrice]);

  const activeFilters = [
    category && { key: 'category', label: t(`categories_data.${category}.label`, { defaultValue: CATEGORIES.find(c=>c.id===category)?.label || category }) },
    region && { key: 'region', label: region },
    q && { key: 'q', label: `"${q}"` },
  ].filter(Boolean);

  return (
    <div className="products-page page-with-header pattern-bg-products">
      {/* Page Header */}
      <div className="products-page-header">
        <div className="container">
          <div className="pph-inner">
            <div>
              <h1>{t('products_page.title')}</h1>
              <p>
                {t('products_page.results_count', { count: filtered.length })}
              </p>
            </div>
            <div className="pph-search">
              <Search size={16} />
              <input
                className="pph-search-input"
                placeholder={t('nav.search')}
                value={q}
                onChange={(e) => set('q', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3><Filter size={16} /> {t('products_page.filter_category').replace('Kategoriya', 'Filtrlar')}</h3>
            {activeFilters.length > 0 && (
              <button 
                className="clear-filters" 
                onClick={clearAll}
              >
                {t('products_page.clear_filters')}
              </button>
            )}
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="active-filters">
              {activeFilters.map((f) => (
                <span 
                  key={f.key} 
                  className="active-filter-chip"
                >
                  {f.label} 
                  <button onClick={() => set(f.key, '')}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}

          {/* Category Filter */}
          <FilterGroup title={t('products_page.filter_category')}>
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" name="cat" checked={!category} onChange={() => set('category', '')} />
                <span>{t('categories_page.stat_category').replace('Kategoriya', 'Barchasi')}</span>
              </label>
              {CATEGORIES.map((c) => (
                <label key={c.id} className="filter-option">
                  <input type="radio" name="cat" checked={category===c.id} onChange={() => set('category', c.id)} />
                  <span>
                    <span className="cat-icon-sm"><CategoryIcon name={c.icon} size={13} /></span> 
                    {t(`categories_data.${c.id}.label`, { defaultValue: c.label })}
                  </span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Region Filter */}
          <FilterGroup title={t('products_page.filter_region')}>
            <select 
              className="form-input form-select" 
              value={region} 
              onChange={(e) => set('region', e.target.value)}
            >
              <option value="">{t('products_page.filter_region')}...</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FilterGroup>

          {/* Price Filter */}
          <FilterGroup title={t('products_page.filter_price')}>
            <div className="dual-slider-container">
              <div className="dual-slider-track"></div>
              <div className="dual-slider-range" style={{ 
                left: `${(priceRange[0] / 150000000) * 100}%`, 
                right: `${100 - (priceRange[1] / 150000000) * 100}%` 
              }}></div>
              <input 
                type="range" 
                min={0} 
                max={150000000} 
                step={50000} 
                value={priceRange[0]} 
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 50000);
                  setPriceRange([val, priceRange[1]]);
                }}
                onMouseUp={() => set('minPrice', priceRange[0])}
                onTouchEnd={() => set('minPrice', priceRange[0])}
                className="dual-slider-input" 
              />
              <input 
                type="range" 
                min={0} 
                max={150000000} 
                step={50000} 
                value={priceRange[1]} 
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 50000);
                  setPriceRange([priceRange[0], val]);
                }}
                onMouseUp={() => set('maxPrice', priceRange[1])}
                onTouchEnd={() => set('maxPrice', priceRange[1])}
                className="dual-slider-input" 
              />
            </div>
            <div className="price-inputs">
              <input type="number" className="form-input" placeholder={t('products_page.min_price')} value={priceRange[0]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceRange([val, priceRange[1]]);
                }}
                onBlur={(e) => {
                  set('minPrice', e.target.value);
                }} />
              <span>—</span>
              <input type="number" className="form-input" placeholder={t('products_page.max_price')} value={priceRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceRange([priceRange[0], val]);
                }}
                onBlur={(e) => {
                  set('maxPrice', e.target.value);
                }} />
            </div>
          </FilterGroup>

          {/* Rating */}
          <FilterGroup title={t('products_page.filter_rating')}>
            {[5,4,3].map((r) => (
              <label key={r} className="filter-option">
                <input type="radio" name="rating" />
                <span>{'⭐'.repeat(r)} {t('products_page.rating_and_up', { rating: '' })}</span>
              </label>
            ))}
          </FilterGroup>
        </aside>

        {/* Main content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <button 
              className="btn btn-secondary btn-sm mobile-filter-btn" 
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={15} /> Filtrlar {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            <div className="toolbar-right">
              <select 
                className="form-input sort-select" 
                value={sort} 
                onChange={(e) => set('sort', e.target.value)}
              >
                <option value="newest">{t('products_page.sort_newest')}</option>
                <option value="popular">{t('products_page.sort_popular')}</option>
                <option value="price_asc">{t('products_page.sort_cheapest')}</option>
                <option value="price_desc">{t('products_page.sort_expensive')}</option>
                <option value="rating">{t('products_page.filter_rating')} ({t('products_page.rating_and_up', { rating: '' }).trim()})</option>
              </select>
              <div className="view-toggle">
                <button className={`view-btn ${view==='grid'?'active':''}`} onClick={() => handleViewChange('grid')}><Grid3X3 size={16} /></button>
                <button className={`view-btn ${view==='list'?'active':''}`} onClick={() => handleViewChange('list')}><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className={view === 'grid' ? 'products-grid' : 'products-list'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductCardSkeleton key={i} viewMode={view} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div className="no-results-icon-wrap" style={{
                width: '80px',
                height: '80px',
                background: 'var(--brand-50, #fdf6ee)',
                color: 'var(--brand-500, #d4822a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(212, 130, 42, 0.08)',
                border: '1px solid rgba(212, 130, 42, 0.15)'
              }}>
                <Search size={36} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{t('products_page.no_results')}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('products_page.no_results_desc')}</p>
              <button 
                className="btn btn-primary" 
                onClick={clearAll}
                style={{ margin: '0 auto' }}
              >
                {t('products_page.clear_filters')}
              </button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'products-grid' : 'products-list'}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} viewMode={view} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-group">
      <button className="filter-group-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={15} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      <div 
        className="filter-group-body" 
        style={{ 
          display: open ? 'block' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
