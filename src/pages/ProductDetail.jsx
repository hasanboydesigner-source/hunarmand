import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_REVIEWS, CATEGORIES, formatPrice, getDiscount, getInitials } from '../data/constants';
import { useCartStore, useWishlistStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import toast from 'react-hot-toast';
import {
  Star, Heart, ShoppingCart, Zap, Share2, Flag, MapPin,
  Package, Clock, Shield, ChevronRight, MessageCircle, ExternalLink,
  ChevronLeft, Plus, Minus, CheckCircle2, Truck, RotateCcw
} from 'lucide-react';
import './ProductDetail.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const wished = product ? has(product.id) : false;
  const reviews = MOCK_REVIEWS.filter((r) => r.productId === id);
  const related = MOCK_PRODUCTS.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4);
  const discount = product ? getDiscount(product.price, product.originalPrice) : 0;

  if (!product) return (
    <div className="page-with-header not-found">
      <h2>Mahsulot topilmadi</h2>
      <Link to="/products" className="btn btn-primary">Barcha mahsulotlar</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty} ta "${product.title}" savatga qo'shildi!`, { icon: '🛒' });
  };
  const handleBuyNow = () => { addItem(product, qty); navigate('/cart'); };
  const handleWishlist = () => {
    toggle(product);
    toast(wished ? 'Sevimlilardan olib tashlandi' : "Sevimlilarga qo'shildi", { icon: wished ? '💔' : '❤️' });
  };

  const craftsmanCat = CATEGORIES.find((c) => c.id === product.craftsman?.specialty || c.id === product.category);

  return (
    <div className="pd-page page-with-header">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Bosh sahifa</Link><ChevronRight size={13} />
            <Link to="/products">Mahsulotlar</Link><ChevronRight size={13} />
            <Link to={`/products?category=${product.category}`}>
              {CATEGORIES.find(c => c.id === product.category)?.label}
            </Link><ChevronRight size={13} />
            <span>{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container pd-grid">
        {/* ── Left: Gallery ── */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <Swiper
              spaceBetween={10}
              navigation={false}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="pd-main-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            {discount > 0 && <div className="pd-discount-badge">-{discount}%</div>}
            {product.isNew && <div className="pd-new-badge">Yangi</div>}
            <button className={`pd-wish-btn ${wished ? 'active' : ''}`} onClick={handleWishlist}>
              <Heart size={20} fill={wished ? '#ef4444' : 'none'} color={wished ? '#ef4444' : 'currentColor'} />
            </button>
          </div>
          <div className="pd-thumbnails">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={'auto'}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="pd-thumbs-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="pd-thumb">
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="pd-info">
          <div className="pd-category-tag">
            <span className="cat-icon-sm"><CategoryIcon name={CATEGORIES.find(c => c.id === product.category)?.icon} size={13} /></span>
            {CATEGORIES.find(c => c.id === product.category)?.label}
          </div>
          <h1 className="pd-title">{product.title}</h1>

          <div className="pd-rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
              ))}
            </div>
            <span className="pd-rating-num">{product.rating}</span>
            <span className="pd-review-count">({product.reviewCount} sharh)</span>
            <span className="pd-sold">{product.sold} ta sotilgan</span>
          </div>

          <div className="pd-price-block">
            <span className="pd-price">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="pd-orig-price">{formatPrice(product.originalPrice)}</span>}
            {discount > 0 && <span className="pd-save-badge">-{discount}% tejash</span>}
          </div>

          {/* Quick Specs */}
          <div className="pd-quick-specs">
            <div className="pd-spec">
              <Package size={14} /> <span><strong>SKU:</strong> {product.sku}</span>
            </div>
            <div className="pd-spec">
              <Clock size={14} /> <span><strong>Tayyorlash:</strong> {product.productionTime}</span>
            </div>
            <div className="pd-spec">
              <Shield size={14} /> <span><strong>Material:</strong> {product.materials}</span>
            </div>
          </div>

          {/* Stock */}
          <div className={`pd-stock ${product.inStock === 0 ? 'out' : product.inStock <= 3 ? 'low' : 'in'}`}>
            <CheckCircle2 size={15} />
            {product.inStock === 0 ? 'Mahsulot tugagan' : product.inStock <= 3 ? `Faqat ${product.inStock} ta qoldi!` : `Mavjud (${product.inStock} ta)`}
          </div>

          {/* Qty + Actions */}
          <div className="pd-qty-row">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(Math.min(product.inStock, qty + 1))}><Plus size={14} /></button>
            </div>
            <div className="pd-actions">
              <button className="btn btn-primary btn-lg pd-action-btn" onClick={handleAddToCart} disabled={product.inStock === 0}>
                <ShoppingCart size={17} /> Savatga
              </button>
              <button className="btn btn-secondary btn-lg pd-action-btn" onClick={handleBuyNow} disabled={product.inStock === 0}>
                <Zap size={17} /> Hozir sotib ol
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="pd-guarantees">
            <div className="pd-guarantee"><Truck size={16} /><span>Toshkent bo'ylab bepul yetkazib berish</span></div>
            <div className="pd-guarantee"><RotateCcw size={16} /><span>14 kun ichida qaytarish mumkin</span></div>
            <div className="pd-guarantee"><Shield size={16} /><span>Sifat kafolati berilgan</span></div>
          </div>

          {/* ── Craftsman Card ── */}
          <div className="craftsman-card-pd">
            <div className="cc-header">
              <div className="avatar avatar-lg">{getInitials(product.craftsman?.name)}</div>
              <div className="cc-info">
                <div className="cc-name-row">
                  <h4>{product.craftsman?.name}</h4>
                  {product.craftsman?.isVerified && <CheckCircle2 size={15} className="verified-icon" />}
                </div>
                <p className="cc-region"><MapPin size={12} /> {product.craftsman?.region}</p>
                <div className="cc-rating">
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span>{product.craftsman?.rating}</span>
                </div>
              </div>
            </div>
            <div className="cc-actions">
              <Link to={`/craftsmen/${product.craftsman?.id}`} className="btn btn-secondary btn-sm">
                <ExternalLink size={13} /> Do'konni ko'rish
              </Link>
              <a
                href={`https://wa.me/${product.craftsman?.whatsapp || '998901234567'}`}
                target="_blank" rel="noreferrer"
                className="btn btn-sm whatsapp-btn"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="container pd-tabs-section">
        <div className="pd-tabs">
          {['desc', 'specs', 'reviews'].map((tab) => (
            <button key={tab} className={`pd-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'desc' ? 'Tavsif' : tab === 'specs' ? 'Xususiyatlar' : `Sharhlar (${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="pd-tab-content">
          {activeTab === 'desc' && (
            <div className="prose">
              <p>{product.description}</p>
              {product.careInstructions && <p><strong>Parvarish:</strong> {product.careInstructions}</p>}
            </div>
          )}

          {activeTab === 'specs' && (
            <table className="table specs-table">
              <tbody>
                <tr><td>Material</td><td>{product.materials}</td></tr>
                <tr><td>O'lchami</td><td>{product.dimensions}</td></tr>
                <tr><td>Og'irligi</td><td>{product.weight}</td></tr>
                <tr><td>SKU</td><td>{product.sku}</td></tr>
                <tr><td>Tayyorlash vaqti</td><td>{product.productionTime}</td></tr>
                <tr><td>Kategoriya</td><td>{CATEGORIES.find(c => c.id === product.category)?.label}</td></tr>
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <div className="reviews-summary">
                <div className="reviews-score">
                  <span className="big-score">{product.rating}</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />)}
                  </div>
                  <p>{product.reviewCount} ta sharh</p>
                </div>
              </div>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">Hali sharh qoldirilmagan</p>
                ) : reviews.map((r) => (
                  <div key={r.id} className="review-item">
                    <div className="review-header">
                      <div className="avatar avatar-sm">{r.author[0]}</div>
                      <div>
                        <div className="review-author-row">
                          <strong>{r.author}</strong>
                          {r.verified && <span className="verified-purchase">✓ Tasdiqlangan xarid</span>}
                        </div>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= r.rating ? '#f59e0b' : 'none'} color="#f59e0b" />)}
                        </div>
                      </div>
                      <span className="review-date">{r.date}</span>
                    </div>
                    <p className="review-text">{r.text}</p>
                    <button className="review-helpful">👍 Foydali ({r.helpful})</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <div className="container pd-related">
          <h2>O'xshash mahsulotlar</h2>
          <div className="products-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
      {/* Mobile Sticky Action Bar */}
      <div className="pd-mobile-sticky-bar">
        <button
          className={`pd-msb-wish-btn ${wished ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart size={20} fill={wished ? "#ef4444" : "none"} color={wished ? "#ef4444" : "currentColor"} />
        </button>
        <div className="pd-msb-actions">
          <button className="btn btn-primary pd-msb-action-btn" onClick={handleAddToCart} disabled={product.inStock === 0}>
            <ShoppingCart size={17} /> Savatga
          </button>
          <button className="btn btn-secondary pd-msb-action-btn" onClick={handleBuyNow} disabled={product.inStock === 0}>
            <Zap size={17} /> Hozir sotib ol
          </button>
        </div>
      </div>
    </div>
  );
}
