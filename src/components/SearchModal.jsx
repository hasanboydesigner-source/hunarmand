import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useStore';
import { MOCK_PRODUCTS, CATEGORIES, API_URL } from '../data/constants';
import CategoryIcon from './CategoryIcon';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, X, TrendingUp, Clock, ArrowRight, Camera, Sparkles, ArrowLeft } from 'lucide-react';
import './SearchModal.css';

const TRENDING = ['Rishton keramika', 'Buxoro gilam', 'Atlas mato', 'Kumush uzuk', 'Mis samovar'];

export default function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('search-recent') || '[]'));
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleVisualSearch = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsVisualSearch(true);
    setVisualLoading(true);
    setQuery("Rasmdagiga o'xshash mahsulotlar");
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await axios.post(`${API_URL}/search/visual`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResults(res.data || []);
      if (res.data && res.data.length === 0) {
        toast.info("Rasmga o'xshash mahsulot topilmadi.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Qidiruvda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      setResults([]);
    } finally {
      setVisualLoading(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="search-overlay" onClick={closeSearch}>
      <div className="search-modal animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="search-input-wrap">
          {isMobile ? (
            <button className="search-back-btn" onClick={closeSearch} aria-label="Orqaga">
              <ArrowLeft size={22} />
            </button>
          ) : (
            <Search size={20} className="search-icon" />
          )}
          <input
            ref={inputRef}
            className="search-input"
            placeholder={isMobile ? "Mahsulot yoki hunarmand..." : "Mahsulot, hunarmand yoki kategoriya..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            id="global-search-input"
          />
          {query && !isVisualSearch && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Tozalash"><X size={16} /></button>
          )}
          
          {/* Visual Search Button */}
          <button 
            className="search-camera-btn" 
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f2', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: '#c97a22', marginLeft: '8px' }}
            title="Rasm orqali qidirish"
          >
            <Camera size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleVisualSearch} 
            accept="image/jpeg, image/png, image/webp" 
            style={{ display: 'none' }} 
          />

          {!isMobile && (
            <button className="search-close" onClick={closeSearch} style={{ marginLeft: '8px' }} aria-label="Yopish"><X size={20} /></button>
          )}
        </div>

        <div className="search-body">
          {/* Visual Search Loading */}
          {isVisualSearch && visualLoading && (
            <div className="visual-search-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '20px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid #f5f4f2', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid #c97a22', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
                <Sparkles size={32} color="#c97a22" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 1.5s infinite' }} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 8px', fontFamily: 'Italiana, serif' }}>AI Analiz Qilmoqda...</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, maxWidth: '280px' }}>Rasmdagi ob'yektning rangi, naqshi va shakli orqali eng o'xshash mahsulotlar qidirilmoqda.</p>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); } }
              `}} />
            </div>
          )}

          {/* Results */}
          {!visualLoading && results.length > 0 && (
            <div className="search-section">
              <p className="search-section-title">Natijalar</p>
              {results.map((p) => (
                <button key={p._id || p.id} className="search-result-item" onClick={() => { closeSearch(); navigate(`/products/${p._id || p.id}`); }}>
                  <img src={p.image} alt={p.title} className="search-result-img" />
                  <div className="search-result-info">
                    <p className="search-result-title">{p.title}</p>
                    <p className="search-result-meta">{p.craftsman?.name || p.craftsman?.shopName} • {p.craftsman?.region || 'O\'zbekiston'}</p>
                  </div>
                  <ArrowRight size={14} className="search-result-arrow" />
                </button>
              ))}
              <button className="search-see-all" onClick={() => handleSearch()}>
                {isVisualSearch ? "Barcha o'xshash natijalarni ko'rish" : "Barcha natijalarni ko'rish"} <ArrowRight size={14} />
              </button>
            </div>
          )}

          {!query && !isVisualSearch && !visualLoading && (
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

          {query && results.length === 0 && !visualLoading && (
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
