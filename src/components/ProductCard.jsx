import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye, Zap } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../store/useStore';
import { formatPrice, getDiscount, getInitials } from '../data/constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import './ProductCard.css';

const MotionLink = motion(Link);

// Spring preset for the card container entrance
const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 16,
  mass: 0.8
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 15,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

const listVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    x: 10,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

const badgeTransition = (delay) => ({
  type: "spring",
  stiffness: 260,
  damping: 15,
  delay: delay
});

export default function ProductCard({ product, viewMode = 'grid' }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wished = has(product.id);
  const discount = getDiscount(product.price, product.originalPrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`"${product.title}" savatga qo'shildi!`, {
      icon: '🛒',
      style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast(wished ? 'Sevimlilardan olib tashlandi' : "Sevimlilarga qo'shildi", {
      icon: wished ? '💔' : '❤️',
      style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' },
    });
  };

  if (viewMode === 'list') {
    return (
      <MotionLink
        layout
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ x: 6, transition: { duration: 0.2, ease: "easeOut" } }}
        to={`/products/${product.id}`}
        className="product-card-list"
      >
        <div className="pcl-image">
          <motion.img 
            src={product.image} 
            alt={product.title} 
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
          {discount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={badgeTransition(0.1)}
              className="pc-discount-badge"
            >
              -{discount}%
            </motion.span>
          )}
        </div>
        <div className="pcl-body">
          <div className="pcl-meta">
            <span className="pc-category">{product.category}</span>
            {product.isNew && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={badgeTransition(0.15)}
                className="badge badge-success"
              >
                Yangi
              </motion.span>
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
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
              ))}
            </div>
            <span>{product.rating}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <div className="pc-price-block">
            <p className="pc-price">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="pc-original">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <motion.button 
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="btn btn-primary btn-sm" 
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} /> Savatga
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            animate={{ scale: wished ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={`btn btn-icon ${wished ? 'wished' : 'btn-ghost'}`} 
            onClick={handleWishlist}
          >
            <Heart size={16} fill={wished ? '#ef4444' : 'none'} color={wished ? '#ef4444' : 'currentColor'} />
          </motion.button>
        </div>
      </MotionLink>
    );
  }

  return (
    <MotionLink
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -8, transition: { duration: 0.22, ease: "easeOut" } }}
      to={`/products/${product.id}`}
      className="product-card"
    >
      <div className="pc-image-wrap">
        <motion.img 
          src={product.image} 
          alt={product.title} 
          loading="lazy" 
          className="pc-image" 
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Badges */}
        <div className="pc-badges">
          {discount > 0 && (
            <motion.span 
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={badgeTransition(0.1)}
              className="pc-discount-badge"
            >
              -{discount}%
            </motion.span>
          )}
          {product.isNew && (
            <motion.span 
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={badgeTransition(0.15)}
              className="pc-new-badge"
            >
              Yangi
            </motion.span>
          )}
          {product.featured && (
            <motion.span 
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={badgeTransition(0.2)}
              className="pc-featured-badge"
            >
              <Zap size={10} />Top
            </motion.span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="pc-overlay">
          <motion.button 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            animate={{ scale: wished ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={`pc-action-btn ${wished ? 'active-wish' : ''}`} 
            onClick={handleWishlist} 
            title="Sevimlilarga"
          >
            <Heart size={16} fill={wished ? '#ef4444' : 'none'} color={wished ? '#ef4444' : 'currentColor'} />
          </motion.button>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link to={`/products/${product.id}`} className="pc-action-btn" title="Ko'rish">
              <Eye size={16} />
            </Link>
          </motion.div>
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
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
            ))}
          </div>
          <span className="rating-num">{product.rating}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        <div className="pc-footer">
          <div className="pc-price-block">
            <p className="pc-price">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="pc-original">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="pc-cart-btn"
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            title="Savatga qo'shish"
          >
            <ShoppingCart size={16} />
            <span className="pc-cart-btn-text">Sotib olish</span>
          </motion.button>
        </div>
      </div>
    </MotionLink>
  );
}
