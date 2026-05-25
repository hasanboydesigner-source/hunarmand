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

export default function ProductsPage() {
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
    category && { key: 'category', label: CATEGORIES.find(c=>c.id===category)?.label || category },
    region && { key: 'region', label: region },
    q && { key: 'q', label: `"${q}"` },
  ].filter(Boolean);

  return (
    <div className="products-page page-with-header">
      {/* Page Header */}
      <div className="products-page-header">
        <div className="container">
          <div className="pph-inner">
            <div>
              <h1>Barcha mahsulotlar</h1>
              <p>
                {filtered.length} ta mahsulot topildi
              </p>
            </div>
            <div className="pph-search">
              <Search size={16} />
              <input
                className="pph-search-input"
                placeholder="Mahsulot qidiring..."
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
            <h3><Filter size={16} /> Filtrlar</h3>
            {activeFilters.length > 0 && (
              <button 
                className="clear-filters" 
                onClick={clearAll}
              >
                Tozalash
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
          <FilterGroup title="Kategoriya">
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" name="cat" checked={!category} onChange={() => set('category', '')} />
                <span>Barchasi</span>
              </label>
              {CATEGORIES.map((c) => (
                <label key={c.id} className="filter-option">
                  <input type="radio" name="cat" checked={category===c.id} onChange={() => set('category', c.id)} />
                  <span>
                    <span className="cat-icon-sm"><CategoryIcon name={c.icon} size={13} /></span> 
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Region Filter */}
          <FilterGroup title="Hudud">
            <select 
              className="form-input form-select" 
              value={region} 
              onChange={(e) => set('region', e.target.value)}
            >
              <option value="">Barcha hududlar</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FilterGroup>

          {/* Price Filter */}
          <FilterGroup title="Narx oralig'i">
            <div style={{ padding: '10px 10px 20px', marginBottom: '5px' }}>
              <Slider
                range
                min={0}
                max={150000000}
                step={50000}
                value={priceRange}
                onChange={(val) => setPriceRange(val)}
                onChangeComplete={(val) => {
                  set('minPrice', val[0]);
                  set('maxPrice', val[1]);
                }}
                trackStyle={[{ backgroundColor: 'var(--brand-500, #d4822a)' }]}
                handleStyle={[
                  { borderColor: 'var(--brand-500, #d4822a)', backgroundColor: '#fff', opacity: 1 },
                  { borderColor: 'var(--brand-500, #d4822a)', backgroundColor: '#fff', opacity: 1 }
                ]}
              />
            </div>
            <div className="price-inputs" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              <span>{formatPrice(priceRange[0])}</span>
              <span>—</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </FilterGroup>

          {/* Rating */}
          <FilterGroup title="Reyting">
            {[5,4,3].map((r) => (
              <label key={r} className="filter-option">
                <input type="radio" name="rating" />
                <span>{'⭐'.repeat(r)} va yuqori</span>
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
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className="view-toggle">
                <button className={`view-btn ${view==='grid'?'active':''}`} onClick={() => setView('grid')}><Grid3X3 size={16} /></button>
                <button className={`view-btn ${view==='list'?'active':''}`} onClick={() => setView('list')}><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="products-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductCardSkeleton key={i} />
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
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Mahsulot topilmadi</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Filtrlarni o'zgartirib ko'ring yoki boshqa kalit so'z kiriting</p>
              <button 
                className="btn btn-primary" 
                onClick={clearAll}
                style={{ margin: '0 auto' }}
              >
                Filtrlarni tozalash
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
