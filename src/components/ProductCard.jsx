import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye, Zap } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore } from '../store/useStore';
import { formatPrice, getDiscount, getInitials } from '../data/constants';
import { toast } from 'react-toastify';
import './ProductCard.css';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wished = has(product._id || product.id);
  const discount = getDiscount(product.price, product.originalPrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Xarid qilish uchun avval ro'yxatdan o'ting yoki tizimga kiring!", { 
        icon: '🔑', 
        duration: 4000 
      });
      navigate(`/auth/login?redirect=${encodeURIComponent(`/products/${product._id || product.id}`)}`);
      return;
    }
    addItem(product);
    toast.success(`"${product.title}" savatga qo'shildi!`, {
      icon: '🛒',
      style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sevimlilarga qo'shish uchun avval ro'yxatdan o'ting yoki tizimga kiring!", { 
        icon: '🔑', 
        duration: 4000 
      });
      navigate(`/auth/login?redirect=${encodeURIComponent(`/products/${product._id || product.id}`)}`);
      return;
    }
    toggle(product);
    toast(wished ? 'Sevimlilardan olib tashlandi' : "Sevimlilarga qo'shildi", {
      icon: wished ? '💔' : '❤️',
      style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' },
    });
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="product-card-list"
      >
        <div className="pcl-image">
          <img
            src={product.image}
            alt={product.title}
          />
          {discount > 0 && (
            <span className="pc-discount-badge">
              -{discount}%
            </span>
          )}
        </div>
        <div className="pcl-body">
          <div className="pcl-meta">
            <span className="pc-category">{product.category}</span>
            {product.isNew && (
              <span className="badge badge-success">
                Yangi
              </span>
            )}
          </div>

          <h3 className="pcl-title">{product.title}</h3>

          <p className="pcl-desc">
            {product.description?.slice(0, 100)}...
          </p>

          <div className="pc-craftsman">
            <div className="avatar avatar-sm">{getInitials(product.craftsman?.name)}</div>
            <span>{product.craftsman?.name}</span>
            <span className="craftsman-region">• {product.craftsman?.region}</span>
          </div>
        </div>
        <div className="pcl-actions">
          <div className="pc-rating">
            <div className="stars" style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
              ))}
            </div>
            <span>{Number(product.rating || 0).toFixed(1)}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <div className="pc-price-block">
            <p className="pc-price">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="pc-original">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} /> Savatga
          </button>
          <button
            className={`btn btn-icon ${wished ? 'wished' : 'btn-ghost'}`}
            onClick={handleWishlist}
          >
            <Heart size={16} fill={wished ? '#ef4444' : 'none'} color={wished ? '#ef4444' : 'currentColor'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="product-card"
    >
      <div className="pc-image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="pc-image"
        />

        {/* Badges */}
        <div className="pc-badges">
          {discount > 0 && (
            <span className="pc-discount-badge">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="pc-new-badge">
              Yangi
            </span>
          )}
          {product.featured && (
            <span className="pc-featured-badge">
              <Zap size={10} />Top
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="pc-overlay">
          <button
            className={`pc-action-btn ${wished ? 'active-wish' : ''}`}
            onClick={handleWishlist}
            title="Sevimlilarga"
          >
            <Heart size={16} fill={wished ? '#ef4444' : 'none'} color={wished ? '#ef4444' : 'currentColor'} />
          </button>
          <div>
            <Link to={`/products/${product._id || product.id}`} className="pc-action-btn" title="Ko'rish">
              <Eye size={16} />
            </Link>
          </div>
        </div>

        {/* Stock */}
        {product.inStock <= 3 && product.inStock > 0 && (
          <div className="pc-low-stock">Faqat {product.inStock} ta</div>
        )}
        {product.inStock === 0 && <div className="pc-out-stock">Tugagan</div>}
      </div>

      <div className="pc-body">
        <div className="pc-craftsman">
          <div className="avatar avatar-sm">{getInitials(product.craftsman?.name)}</div>
          <div>
            <p className="craftsman-name">{product.craftsman?.name}</p>
            <p className="craftsman-region">{product.craftsman?.region}</p>
          </div>
        </div>

        <h3 className="pc-title">{product.title}</h3>

        <div className="pc-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
            ))}
          </div>
          <span className="rating-num">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        <div className="pc-footer">
          <div className="pc-price-block">
            <p className="pc-price">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="pc-original">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <button
            className="pc-cart-btn"
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            title="Savatga qo'shish"
          >
            <ShoppingCart size={16} />
            <span className="pc-cart-btn-text">Sotib olish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
