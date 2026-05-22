import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES, REGIONS, SORT_OPTIONS, formatPrice } from '../data/constants';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Products.css';

// Senior-level animation presets
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

const filterContentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const filterItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 150, damping: 14 } 
  }
};

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 16
};

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') || '';
  const region = params.get('region') || '';
  const sort = params.get('sort') || 'newest';
  const q = params.get('q') || '';
  const minPrice = Number(params.get('minPrice') || 0);
  const maxPrice = Number(params.get('maxPrice') || 3000000);

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
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="products-page-header"
      >
        <div className="container">
          <div className="pph-inner">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <h1>Barcha mahsulotlar</h1>
              <motion.p
                key={filtered.length}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filtered.length} ta mahsulot topildi
              </motion.p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.05 }}
              className="pph-search"
            >
              <Search size={16} />
              <input
                className="pph-search-input"
                placeholder="Mahsulot qidiring..."
                value={q}
                onChange={(e) => set('q', e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container products-layout">
        {/* Sidebar Filters */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}
        >
          <div className="filters-header">
            <h3><Filter size={16} /> Filtrlar</h3>
            {activeFilters.length > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="clear-filters" 
                onClick={clearAll}
              >
                Tozalash
              </motion.button>
            )}
          </div>

          {/* Active Filters */}
          <AnimatePresence initial={false}>
            {activeFilters.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="active-filters"
                style={{ overflow: "hidden" }}
              >
                <AnimatePresence>
                  {activeFilters.map((f) => (
                    <motion.span 
                      key={f.key} 
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -10 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="active-filter-chip"
                    >
                      {f.label} 
                      <button onClick={() => set(f.key, '')}><X size={12} /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter */}
          <FilterGroup title="Kategoriya">
            <div className="filter-options">
              <motion.label variants={filterItemVariants} className="filter-option">
                <input type="radio" name="cat" checked={!category} onChange={() => set('category', '')} />
                <span>Barchasi</span>
              </motion.label>
              {CATEGORIES.map((c) => (
                <motion.label key={c.id} variants={filterItemVariants} className="filter-option">
                  <input type="radio" name="cat" checked={category===c.id} onChange={() => set('category', c.id)} />
                  <span>
                    <span className="cat-icon-sm"><CategoryIcon name={c.icon} size={13} /></span> 
                    {c.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </FilterGroup>

          {/* Region Filter */}
          <FilterGroup title="Hudud">
            <motion.select 
              variants={filterItemVariants} 
              className="form-input form-select" 
              value={region} 
              onChange={(e) => set('region', e.target.value)}
            >
              <option value="">Barcha hududlar</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </motion.select>
          </FilterGroup>

          {/* Price Filter */}
          <FilterGroup title="Narx oralig'i">
            <motion.div variants={filterItemVariants} className="price-inputs">
              <input type="number" className="form-input" placeholder="Min" defaultValue={minPrice}
                onBlur={(e) => set('minPrice', e.target.value)} />
              <span>—</span>
              <input type="number" className="form-input" placeholder="Max" defaultValue={maxPrice}
                onBlur={(e) => set('maxPrice', e.target.value)} />
            </motion.div>
          </FilterGroup>

          {/* Rating */}
          <FilterGroup title="Reyting">
            {[5,4,3].map((r) => (
              <motion.label key={r} variants={filterItemVariants} className="filter-option">
                <input type="radio" name="rating" />
                <span>{'⭐'.repeat(r)} va yuqori</span>
              </motion.label>
            ))}
          </FilterGroup>
        </motion.aside>

        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="products-main"
        >
          {/* Toolbar */}
          <div className="products-toolbar">
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springTransition}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary btn-sm mobile-filter-btn" 
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={15} /> Filtrlar {activeFilters.length > 0 && `(${activeFilters.length})`}
            </motion.button>
            <div className="toolbar-right">
              <motion.select 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.05 }}
                className="form-input sort-select" 
                value={sort} 
                onChange={(e) => set('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </motion.select>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springTransition, delay: 0.1 }}
                className="view-toggle"
              >
                <button className={`view-btn ${view==='grid'?'active':''}`} onClick={() => setView('grid')}><Grid3X3 size={16} /></button>
                <button className={`view-btn ${view==='list'?'active':''}`} onClick={() => setView('list')}><List size={16} /></button>
              </motion.div>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="no-results"
              >
                <span className="no-results-icon">🔍</span>
                <h3>Mahsulot topilmadi</h3>
                <p>Filtrlarni o'zgartirib ko'ring yoki boshqa kalit so'z kiriting</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary" 
                  onClick={clearAll}
                >
                  Filtrlarni tozalash
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="products-container"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className={view === 'grid' ? 'products-grid' : 'products-list'}
              >
                {filtered.map((p) => <ProductCard key={p.id} product={p} viewMode={view} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
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
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <ChevronDown size={15} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <motion.div 
              variants={filterContentVariants}
              initial="hidden"
              animate="show"
              className="filter-group-body"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
