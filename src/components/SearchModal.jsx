import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useStore';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/constants';
import CategoryIcon from './CategoryIcon';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import './SearchModal.css';

const TRENDING = ['Rishton keramika', 'Buxoro gilam', 'Atlas mato', 'Kumush uzuk', 'Mis samovar'];

export default function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('search-recent') || '[]'));
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) { setTimeout(() => inputRef.current?.focus(), 100); setQuery(''); setResults([]); }
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeSearch(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSearch]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const found = MOCK_PRODUCTS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.craftsman?.name.toLowerCase().includes(q)
    ).slice(0, 5);
    setResults(found);
  }, [query]);

  const handleSearch = (q) => {
    const term = q || query;
    if (!term.trim()) return;
    const updated = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('search-recent', JSON.stringify(updated));
    closeSearch();
    navigate(`/products?q=${encodeURIComponent(term)}`);
    setQuery('');
  };

  const clearRecent = () => { setRecent([]); localStorage.removeItem('search-recent'); };

  if (!searchOpen) return null;

  return (
    <div className="search-overlay" onClick={closeSearch}>
      <div className="search-modal animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="search-input-wrap">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Mahsulot, hunarmand yoki kategoriya..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            id="global-search-input"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}><X size={16} /></button>
          )}
          <button className="search-close" onClick={closeSearch}><X size={20} /></button>
        </div>

        <div className="search-body">
          {/* Results */}
          {results.length > 0 && (
            <div className="search-section">
              <p className="search-section-title">Natijalar</p>
              {results.map((p) => (
                <button key={p.id} className="search-result-item" onClick={() => { closeSearch(); navigate(`/products/${p.id}`); }}>
                  <img src={p.image} alt={p.title} className="search-result-img" />
                  <div className="search-result-info">
                    <p className="search-result-title">{p.title}</p>
                    <p className="search-result-meta">{p.craftsman?.name} • {p.craftsman?.region}</p>
                  </div>
                  <ArrowRight size={14} className="search-result-arrow" />
                </button>
              ))}
              <button className="search-see-all" onClick={() => handleSearch()}>
                Barcha natijalarni ko'rish <ArrowRight size={14} />
              </button>
            </div>
          )}

          {!query && (
            <>
              {/* Recent */}
              {recent.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <p className="search-section-title"><Clock size={14} /> So'nggi qidiruvlar</p>
                    <button className="search-clear-btn" onClick={clearRecent}>Tozalash</button>
                  </div>
                  <div className="search-chips">
                    {recent.map((r) => (
                      <button key={r} className="search-chip" onClick={() => { setQuery(r); handleSearch(r); }}>{r}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div className="search-section">
                <p className="search-section-title"><TrendingUp size={14} /> Mashhur qidiruvlar</p>
                <div className="search-chips">
                  {TRENDING.map((t) => (
                    <button key={t} className="search-chip chip-trending" onClick={() => handleSearch(t)}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="search-section">
                <p className="search-section-title">Kategoriyalar</p>
                <div className="search-categories">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} className="search-cat-item"
                      onClick={() => { closeSearch(); navigate(`/products?category=${c.id}`); }}>
                      <span className="cat-icon"><CategoryIcon name={c.icon} size={20} /></span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {query && results.length === 0 && (
            <div className="search-empty">
              <Search size={40} opacity={0.2} />
              <p>"{query}" bo'yicha natija topilmadi</p>
              <span>Boshqa kalit so'z bilan qidirib ko'ring</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
