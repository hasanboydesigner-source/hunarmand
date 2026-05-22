import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { MOCK_CRAFTSMEN, CATEGORIES, REGIONS } from '../data/constants';
import { Search, MapPin, Star, Sparkles, ShieldCheck } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import './CraftsmenList.css';

export default function CraftsmenList() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [specialty, setSpecialty] = useState('');

  const filtered = useMemo(() => {
    return MOCK_CRAFTSMEN.filter((c) => {
      const matchQ = c.name.toLowerCase().includes(q.toLowerCase()) || 
                     c.bio.toLowerCase().includes(q.toLowerCase());
      const matchRegion = region ? c.region === region : true;
      const matchSpec = specialty ? c.specialty === specialty : true;
      return matchQ && matchRegion && matchSpec;
    });
  }, [q, region, specialty]);

  return (
    <div className="craftsmen-list-page page-with-header">
      {/* Hero Header */}
      <div className="clp-header">
        <div className="container">
          <span className="eyebrow">Bizning Ustalar</span>
          <h1>O'zbekistonning Noyob Hunarmandlari</h1>
          <p>O'z kasbining mohir ustalaridan to'g'ridan-to'g'ri xarid qiling. Chegarasiz san'at namunalarini kashf eting.</p>
        </div>
      </div>

      <div className="container clp-layout">
        {/* Filters */}
        <div className="clp-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Hunarmand ismi yoki bio orqali qidirish..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
          </div>
          <div className="filters-row">
            <select className="form-input form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Barcha hududlar</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="form-input form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="">Barcha mutaxassisliklar</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* List of Craftsmen */}
        {filtered.length === 0 ? (
          <div className="no-results" style={{ padding: '80px 20px' }}>
            <span className="no-results-icon">👨‍🎨</span>
            <h3>Hech qanday hunarmand topilmadi</h3>
            <p>Qidiruv shartlarini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="craftsmen-grid">
            {filtered.map((c) => (
              <Link key={c.id} to={`/craftsmen/${c.slug}`} className="craftsman-card">
                <div className="craftsman-cover">
                  <img src={c.coverImage} alt={c.name} />
                  <div className="craftsman-cover-overlay" />
                  {c.isVerified && <span className="verified-badge"><ShieldCheck size={12}/> Tasdiqlangan</span>}
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
                    <span><Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating} ({c.reviewCount} sharh)</span>
                  </div>
                  <div className="craftsman-specialty">
                    <CategoryIcon name={CATEGORIES.find(cat => cat.id === c.specialty)?.icon} size={14} />
                    {CATEGORIES.find(cat => cat.id === c.specialty)?.label}
                  </div>
                  <p className="craftsman-bio-excerpt">{c.bio.slice(0, 100)}...</p>
                  <div className="craftsman-stats-row">
                    <div className="cs-stat"><strong>{c.totalProducts}</strong><span>Mahsulot</span></div>
                    <div className="cs-stat"><strong>{c.totalSales.toLocaleString()}</strong><span>Sotuv</span></div>
                    <div className="cs-stat"><strong>{c.yearsExp}</strong><span>Tajriba yili</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
