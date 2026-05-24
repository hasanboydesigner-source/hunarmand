import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useStore';
import { formatPrice, getInitials } from '../data/constants';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import './Cart.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleRemove = (key, title) => {
    removeItem(key);
    toast(`"${title}" savatdan olib tashlandi`, { icon: '🗑️' });
  };

  if (items.length === 0) {
    return (
      <div className="cart-page page-with-header">
        <div className="container empty-cart">
          <div className="empty-cart-icon"><ShoppingCart size={64} opacity={0.2} /></div>
          <h2>Savat bo'sh</h2>
          <p>Mahsulotlarni savatga qo'shib, xarid qiling</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Xarid qilishni boshlash <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Group by craftsman
  const byCraftsman = items.reduce((acc, item) => {
    const key = item.craftsman?._id || item.craftsman?.id || 'unknown';
    if (!acc[key]) acc[key] = { craftsman: item.craftsman, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

  return (
    <div className="cart-page page-with-header">
      <div className="cart-header">
        <div className="container cart-header-inner">
          <div className="ch-icon-box">
            <ShoppingCart size={28} />
          </div>
          <div className="ch-title-wrap">
            <h1>Savatcha <span className="ch-badge">{items.reduce((s,i)=>s+i.quantity,0)} ta</span></h1>
            <p>Xaridlaringizni xavfsiz rasmiylashtiring</p>
          </div>
        </div>
      </div>

      <div className="container cart-layout">
        {/* Items */}
        <div className="cart-items">
          <div className="cart-items-header">
            <span>Mahsulot</span>
            <span>Narx</span>
            <span>Miqdor</span>
            <span>Jami</span>
          </div>

          {Object.entries(byCraftsman).map(([groupKey, { craftsman, items: groupItems }]) => (
            <div key={groupKey} className="craftsman-group">
              <div className="craftsman-group-header">
                <div className="avatar avatar-sm">{getInitials(craftsman?.name)}</div>
                <strong>{craftsman?.name}</strong>
                <span className="craftsman-group-region">• {craftsman?.region}</span>
                <Link to={`/craftsmen/${craftsman?._id || craftsman?.id}`} className="view-shop-link">
                  <ExternalLink size={13} /> Do'konni ko'rish
                </Link>
              </div>

              {groupItems.map((item) => (
                <div key={item.key} className="cart-item">
                  <div className="ci-product">
                    <img src={item.image} alt={item.title} className="ci-img" />
                    <div className="ci-info">
                      <Link to={`/products/${item.id}`} className="ci-title">{item.title}</Link>
                      {item.variant && <p className="ci-variant">{item.variant}</p>}
                      <div className="ci-price-mobile">{formatPrice(item.price)}</div>
                    </div>
                  </div>
                  <div className="ci-price">{formatPrice(item.price)}</div>
                  <div className="ci-actions-wrapper">
                    <div className="ci-qty">
                      <button className="qty-btn-sm" onClick={() => updateQuantity(item.key, item.quantity-1)}><Minus size={12}/></button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn-sm" onClick={() => updateQuantity(item.key, item.quantity+1)}><Plus size={12}/></button>
                    </div>
                    <div className="ci-total">
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                      <button className="ci-remove" onClick={() => handleRemove(item.key, item.title)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="cart-footer-actions">
            <Link to="/products" className="btn btn-ghost btn-sm">
              <ArrowLeft size={15} /> Xaridni davom ettirish
            </Link>
            <button className="btn btn-ghost btn-sm danger-text" onClick={() => { clearCart(); toast('Savat tozalandi', {icon:'🗑️'}); }}>
              <Trash2 size={14} /> Savatni tozalash
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Buyurtma xulosasi</h3>

          <div className="coupon-row">
            <input className="form-input" placeholder="Promo kod kiriting" />
            <button className="btn btn-secondary btn-sm"><Tag size={14}/> Qo'llash</button>
          </div>

          <div className="summary-lines">
            <div className="summary-line">
              <span>Mahsulotlar ({items.reduce((s,i)=>s+i.quantity,0)} ta)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Yetkazib berish</span>
              <span className={shipping===0?'free':''}>
                {shipping === 0 ? 'Bepul' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-hint">
                {formatPrice(500000 - subtotal)} qo'shsangiz, yetkazib berish bepul bo'ladi
              </p>
            )}
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Jami</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button className="btn btn-primary btn-lg checkout-btn" onClick={() => navigate('/checkout')}>
            Buyurtma berish <ArrowRight size={16} />
          </button>

          <div className="payment-methods">
            <p>To'lov usullari:</p>
            <div className="pm-badges">
              {['Payme','Click','Uzcard','Humo','Naqd'].map(p=>(
                <span key={p} className="pm-badge">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
