import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { MOCK_CRAFTSMEN, CATEGORIES, REGIONS, API_URL } from '../data/constants';
import { Search, MapPin, Star, Sparkles, ShieldCheck, Users } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import axios from 'axios';
import './CraftsmenList.css';

export default function CraftsmenList() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [craftsmen, setCraftsmen] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/auth/craftsmen`),
          axios.get(`${API_URL}/products`).catch(() => ({ data: [] }))
        ]);

        const products = prodRes.data || [];

        if (authRes.data && authRes.data.length > 0) {
          const enriched = authRes.data.map(c => {
            const name = c.name || '';
            const specialty = c.specialty || c.category || '';
            
            const mock = MOCK_CRAFTSMEN?.find(mc => 
              mc.slug === c.slug ||
              mc.id === c.id ||
              mc.name?.toLowerCase() === name.toLowerCase() ||
              (specialty && mc.specialty?.toLowerCase() === specialty.toLowerCase())
            );

            const theirProducts = products.filter(p => {
              const cid = typeof p.craftsman === 'object' ? p.craftsman?._id : p.craftsman;
              return cid === c._id || cid === c.id || (typeof p.craftsman === 'object' && p.craftsman?.name === c.name);
            });
            const theirProduct = theirProducts[0];
            const totalProducts = theirProducts.length;
            const totalSales = theirProducts.reduce((acc, p) => acc + (p.sold || 0), 0);

            const coverImageFallback = specialty === 'keramika'
              ? 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg'
              : specialty === 'gilam'
              ? 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg'
              : specialty === 'zargarlik'
              ? 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp'
              : specialty === 'yogoch'
              ? 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg'
              : specialty === 'to\'qimachilik'
              ? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
              : specialty === 'naqqoshlik'
              ? 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg'
              : specialty === 'misgarlik'
              ? 'https://api.society.uz/media/news/BQ8A4028.webp'
              : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80';

            return {
              ...c,
              coverImage: theirProduct?.image || c.coverImage || mock?.coverImage || coverImageFallback,
              rating: c.rating || mock?.rating || 4.8,
              reviewCount: c.reviewCount || mock?.reviewCount || 15,
              totalSales: totalSales,
              yearsExp: c.yearsExp || 0,
              responseTime: c.responseTime || mock?.responseTime || '< 2 soat',
              totalProducts: totalProducts,
            };
          });
          setCraftsmen(enriched);
        } else {
          setCraftsmen(MOCK_CRAFTSMEN);
        }
      } catch (err) {
        console.error("API error:", err);
        setCraftsmen(MOCK_CRAFTSMEN);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return craftsmen.filter((c) => {
      const matchQ = c.name.toLowerCase().includes(q.toLowerCase()) || 
                     (c.bio || '').toLowerCase().includes(q.toLowerCase());
      const matchRegion = region ? c.region === region : true;
      const matchSpec = specialty ? c.specialty === specialty : true;
      return matchQ && matchRegion && matchSpec;
    });
  }, [q, region, specialty, craftsmen]);

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
          <div className="no-results" style={{ padding: '80px 20px', textAlign: 'center' }}>
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
              <Users size={36} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Hech qanday hunarmand topilmadi</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Qidiruv shartlarini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="craftsmen-grid">
            {filtered.map((c) => (
              <Link key={c._id || c.id} to={`/craftsmen/${c.slug || c._id || c.id}`} className="craftsman-card">
                <div className="craftsman-cover">
                  <img src={c.coverImage || 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80'} alt={c.name} />
                  <div className="craftsman-cover-overlay" />
                  {c.isVerified && <span className="verified-badge"><ShieldCheck size={12}/> Tasdiqlangan</span>}
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
                    <span><Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating} ({c.reviewCount} sharh)</span>
                  </div>
                  <div className="craftsman-specialty">
                    <CategoryIcon name={CATEGORIES.find(cat => cat.id === (c.specialty || c.category))?.icon} size={14} />
                    {CATEGORIES.find(cat => cat.id === (c.specialty || c.category))?.label || c.specialty || 'Hunarmand'}
                  </div>
                  <p className="craftsman-bio-excerpt">{(c.bio || 'Ustaxonamizga xush kelibsiz!').slice(0, 100)}...</p>
                  <div className="craftsman-stats-row">
                    <div className="cs-stat"><strong>{c.totalProducts || 0}</strong><span>Mahsulot</span></div>
                    <div className="cs-stat"><strong>{(c.totalSales || 0).toLocaleString()}</strong><span>Sotuv</span></div>
                    <div className="cs-stat"><strong>{c.yearsExp || 0}</strong><span>Tajriba yili</span></div>
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
