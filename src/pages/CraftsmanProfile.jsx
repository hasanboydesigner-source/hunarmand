import { Link, useParams } from 'react-router-dom';
import { MOCK_CRAFTSMEN, MOCK_PRODUCTS, CATEGORIES, formatPrice } from '../data/constants';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { Star, MapPin, CheckCircle2, MessageCircle, Package, ShoppingBag, Clock, Award } from 'lucide-react';
import './CraftsmanProfile.css';

export default function CraftsmanProfilePage() {
  const { slug } = useParams();
  const craftsman = MOCK_CRAFTSMEN.find(c => c.slug === slug) || MOCK_CRAFTSMEN[0];
  const products = MOCK_PRODUCTS.filter(p => p.craftsman?.id === craftsman.id);
  const cat = CATEGORIES.find(c => c.id === craftsman.specialty);

  return (
    <div className="cp-page page-with-header">
      {/* Cover */}
      <div className="cp-cover">
        <img src={craftsman.coverImage} alt={craftsman.name} />
        <div className="cp-cover-overlay" />
      </div>

      <div className="container">
        <div className="cp-header-card">
          <div className="cp-avatar-wrap">
            <div className="avatar avatar-2xl cp-avatar">
              {craftsman.name.split(' ').map(n=>n[0]).join('')}
            </div>
            {craftsman.isVerified && (
              <div className="cp-verified-badge"><CheckCircle2 size={16}/></div>
            )}
          </div>
          <div className="cp-header-info">
            <div className="cp-name-row">
              <h1>{craftsman.name}</h1>
              {craftsman.isVerified && <span className="badge badge-success">Tasdiqlangan</span>}
            </div>
            <div className="cp-meta-row">
              <span><MapPin size={13}/> {craftsman.city}, {craftsman.region}</span>
              <span><Star size={13} fill="#f59e0b" color="#f59e0b"/> {craftsman.rating} ({craftsman.reviewCount} sharh)</span>
              <span><span className="cat-icon-sm"><CategoryIcon name={cat?.icon} size={13} /></span> {cat?.label}</span>
              <span><Clock size={13}/> Javob: {craftsman.responseTime}</span>
            </div>
            <div className="cp-stats">
              <div className="cp-stat"><strong>{craftsman.totalProducts}</strong><span>Mahsulot</span></div>
              <div className="cp-stat"><strong>{craftsman.totalSales.toLocaleString()}</strong><span>Sotuv</span></div>
              <div className="cp-stat"><strong>{craftsman.yearsExp}</strong><span>Yil tajriba</span></div>
              <div className="cp-stat"><strong>{craftsman.rating}</strong><span>Reyting</span></div>
            </div>
          </div>
          <div className="cp-actions">
            <a href={`https://wa.me/${craftsman.whatsapp}`} target="_blank" rel="noreferrer" className="btn whatsapp-btn btn-lg">
              <MessageCircle size={17}/> WhatsApp
            </a>
            <Link to={`/products?craftsman=${craftsman.id}`} className="btn btn-secondary btn-lg">
              <Package size={17}/> Mahsulotlar
            </Link>
          </div>
        </div>

        <div className="cp-layout">
          {/* Sidebar */}
          <aside className="cp-sidebar">
            <div className="cp-about-card">
              <h3>Hunarmand haqida</h3>
              <p>{craftsman.bio}</p>
            </div>
            <div className="cp-about-card">
              <h3>Ma'lumotlar</h3>
              <div className="cp-info-list">
                <div className="cp-info-item"><Award size={14}/><span>Tajriba: <strong>{craftsman.yearsExp} yil</strong></span></div>
                <div className="cp-info-item"><MapPin size={14}/><span>Joylashuv: <strong>{craftsman.region}</strong></span></div>
                <div className="cp-info-item"><Clock size={14}/><span>Javob vaqti: <strong>{craftsman.responseTime}</strong></span></div>
                <div className="cp-info-item"><ShoppingBag size={14}/><span>Jami sotuv: <strong>{craftsman.totalSales.toLocaleString()}</strong></span></div>
                <div className="cp-info-item"><Package size={14}/><span>Ro'yxatga olingan: <strong>{new Date(craftsman.joinedDate).getFullYear()}</strong></span></div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="cp-products">
            <div className="cp-products-header">
              <h2>Mahsulotlar ({products.length})</h2>
            </div>
            {products.length === 0 ? (
              <div className="cp-no-products">
                <Package size={48} opacity={0.2}/>
                <p>Hozircha mahsulot qo'shilmagan</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p}/>)}
              </div>
            )}
            {products.length === 0 && (
              <div className="products-grid">
                {MOCK_PRODUCTS.slice(0,4).map(p => <ProductCard key={p.id} product={p}/>)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
