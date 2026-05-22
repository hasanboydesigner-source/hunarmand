import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES, REGIONS, SORT_OPTIONS, formatPrice } from '../data/constants';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { ProductCardSkeleton } from '../components/Skeletons';
import './Products.css';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const category = params.get('category') || '';
  const region = params.get('region') || '';
  const sort = params.get('sort') || 'newest';
  const q = params.get('q') || '';
  const minPrice = Number(params.get('minPrice') || 0);
  const maxPrice = Number(params.get('maxPrice') || 3000000);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [category, region, sort, q, minPrice, maxPrice]);

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next);
  };

  const clearAll = () => setParams({});

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS];
    if (q) list = list.filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.craftsman?.name.toLowerCase().includes(q.toLowerCase())
    );
    if (category) list = list.filter(p => p.category === category);
    if (region) list = list.filter(p => p.craftsman?.region === region);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    switch (sort) {
      case 'price_asc': list.sort((a,b) => a.price - b.price); break;
      case 'price_desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating': list.sort((a,b) => b.rating - a.rating); break;
      case 'popular': list.sort((a,b) => b.sold - a.sold); break;
      default: list.sort((a,b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [q, category, region, sort, minPrice, maxPrice]);

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
            <div className="price-inputs">
              <input type="number" className="form-input" placeholder="Min" defaultValue={minPrice}
                onBlur={(e) => set('minPrice', e.target.value)} />
              <span>—</span>
              <input type="number" className="form-input" placeholder="Max" defaultValue={maxPrice}
                onBlur={(e) => set('maxPrice', e.target.value)} />
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
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>Mahsulot topilmadi</h3>
              <p>Filtrlarni o'zgartirib ko'ring yoki boshqa kalit so'z kiriting</p>
              <button 
                className="btn btn-primary" 
                onClick={clearAll}
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
