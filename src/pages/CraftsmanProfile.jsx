import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MOCK_CRAFTSMEN, MOCK_PRODUCTS, CATEGORIES, API_URL } from '../data/constants';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import { Star, MapPin, CheckCircle2, Send, Package, ShoppingBag, Clock, Award, MessageCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useStore';
import './CraftsmanProfile.css';

export default function CraftsmanProfilePage() {
  const { slug } = useParams(); // slug is actually ID now
  const { user } = useAuthStore();
  const [craftsman, setCraftsman] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch craftsman and products in parallel
        const [{ data: cData }, prodRes] = await Promise.all([
          axios.get(`${API_URL}/auth/craftsmen/${slug}`),
          axios.get(`${API_URL}/products`).catch(() => ({ data: [] }))
        ]);

        setCraftsman(cData);

        const pData = prodRes.data || [];
        const cProducts = pData.filter(p => {
          const cid = typeof p.craftsman === 'object' ? p.craftsman?._id : p.craftsman;
          return cid === cData._id;
        });
        setProducts(cProducts);
        setLoading(false);
      } catch (err) {
        console.error("Xatolik:", err);
        // Fallback to mock data if API fails
        const mockC = MOCK_CRAFTSMEN?.find(c => c.slug === slug || c.id === slug) || {
          _id: slug,
          name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          role: 'craftsman',
          specialty: 'keramika',
          region: 'Toshkent'
        };
        setCraftsman(mockC);
        setProducts(MOCK_PRODUCTS.filter(p => p.craftsman?.id === mockC.id || p.craftsman?.id === slug));
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="page-with-header" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>Yuklanmoqda...</div>;
  }

  if (!craftsman) {
    return <div className="page-with-header" style={{ padding: '40px', textAlign: 'center' }}>Hunarmand topilmadi</div>;
  }

  const cat = CATEGORIES.find(c => c.id === craftsman.specialty);
  
  // Find matching mock craftsman to copy corresponding coverImage and other rich details
  const mockC = MOCK_CRAFTSMEN?.find(mc => 
    mc.slug === slug || 
    mc.id === slug || 
    mc.name?.toLowerCase() === craftsman.name?.toLowerCase() ||
    (craftsman.specialty && mc.specialty?.toLowerCase() === craftsman.specialty?.toLowerCase())
  );
  
  const coverImageFallback = craftsman.specialty === 'keramika'
    ? 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg'
    : craftsman.specialty === 'gilam'
    ? 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg'
    : craftsman.specialty === 'zargarlik'
    ? 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp'
    : craftsman.specialty === 'yogoch'
    ? 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg'
    : craftsman.specialty === 'toʻqimachilik' || craftsman.specialty === 'to\'qimachilik'
    ? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
    : craftsman.specialty === 'naqqoshlik'
    ? 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg'
    : craftsman.specialty === 'misgarlik'
    ? 'https://api.society.uz/media/news/BQ8A4028.webp'
    : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80';

  // Use first product's image as cover if craftsman has uploaded products
  const firstProductImage = products.length > 0 ? (products[0].images?.[0] || products[0].image) : null;
  const coverImage = firstProductImage || craftsman.coverImage || mockC?.coverImage || coverImageFallback;
  const bio = craftsman.bio || "Salom! Men o'z ishimning ustasiman va mijozlarga eng yaxshi sifatdagi mahsulotlarni taqdim etishga harakat qilaman.";
  const yearsExp = craftsman.yearsExp ?? 0; 
  const responseTime = craftsman.responseTime || '< 1 soat';
  const totalSales = products.length > 0 ? products.reduce((acc, p) => acc + (p.sold || 0), 0) : 0;
  const rating = craftsman.rating ?? 0;
  const reviewCount = craftsman.reviewCount ?? 0;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Xabar yuborish uchun tizimga kiring!");
      return;
    }
    if (!messageText.trim()) return;
    try {
      setIsSendingMessage(true);
      await axios.post(`${API_URL}/messages`, {
        sender: user.name,
        senderId: user.id || user._id,
        receiverId: craftsman._id || craftsman.id,
        text: messageText,
        avatar: user.avatar || ''
      });
      toast.success("Xabar muvaffaqiyatli yuborildi!");
      setShowMessageModal(false);
      setMessageText('');
    } catch (err) {
      toast.error("Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="cp-page page-with-header">
      {/* Cover */}
      <div className="cp-cover">
        <img src={coverImage} alt={craftsman.shopName || craftsman.name} />
        <div className="cp-cover-overlay" />
      </div>

      <div className="container">
        <div className="cp-header-card">
          <div className="cp-avatar-wrap">
            <div className="avatar avatar-2xl cp-avatar">
              {(craftsman.shopName || craftsman.name).split(' ').map(n=>n[0]).join('').substring(0,2)}
            </div>
            {craftsman.isVerified && (
              <div className="cp-verified-badge"><CheckCircle2 size={16}/></div>
            )}
          </div>
          <div className="cp-header-info">
            <div className="cp-name-row">
              <h1>{craftsman.shopName || craftsman.name}</h1>
              {craftsman.isVerified && <span className="badge badge-success">Tasdiqlangan</span>}
            </div>
            <div className="cp-meta-row">
              <span><MapPin size={13}/> {craftsman.region || 'O\'zbekiston'}</span>
              <span><Star size={13} fill="#f59e0b" color="#f59e0b"/> {rating} ({reviewCount} sharh)</span>
              <span><span className="cat-icon-sm"><CategoryIcon name={cat?.icon} size={13} /></span> {cat?.label || craftsman.specialty || 'Hunarmand'}</span>
              <span><Clock size={13}/> Javob: {responseTime}</span>
            </div>
            <div className="cp-stats">
              <div className="cp-stat"><strong>{products.length}</strong><span>Mahsulot</span></div>
              <div className="cp-stat"><strong>{totalSales.toLocaleString()}</strong><span>Sotuv</span></div>
              <div className="cp-stat"><strong>{yearsExp}</strong><span>Yil tajriba</span></div>
              <div className="cp-stat"><strong>{rating}</strong><span>Reyting</span></div>
            </div>
          </div>
          <div className="cp-actions">
            <button 
              onClick={() => setShowMessageModal(true)} 
              className="btn btn-secondary btn-lg"
              style={{ marginRight: '10px' }}
            >
              <MessageCircle size={17}/> Xabar yozish
            </button>
            <a href={`https://t.me/${craftsman.telegram || 'E_Hunarmand_bot'}`} target="_blank" rel="noreferrer" className="btn telegram-btn btn-lg">
              <Send size={17}/> Telegram
            </a>
          </div>
        </div>

        <div className="cp-layout">
          {/* Sidebar */}
          <aside className="cp-sidebar">
            <div className="cp-about-card">
              <h3>Hunarmand haqida</h3>
              <p>{bio}</p>
            </div>
            <div className="cp-about-card">
              <h3>Ma'lumotlar</h3>
              <div className="cp-info-list">
                <div className="cp-info-item"><Award size={14}/><span>Tajriba: <strong>{yearsExp} yil</strong></span></div>
                <div className="cp-info-item"><MapPin size={14}/><span>Joylashuv: <strong>{craftsman.region || 'Noma\'lum'}</strong></span></div>
                <div className="cp-info-item"><Clock size={14}/><span>Javob vaqti: <strong>{responseTime}</strong></span></div>
                <div className="cp-info-item"><ShoppingBag size={14}/><span>Jami sotuv: <strong>{totalSales.toLocaleString()}</strong></span></div>
                <div className="cp-info-item"><Package size={14}/><span>Ro'yxatga olingan: <strong>{new Date(craftsman.createdAt || Date.now()).getFullYear()}</strong></span></div>
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
                {products.map(p => <ProductCard key={p._id || p.id} product={p}/>)}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content animate-zoomIn" onClick={e => e.stopPropagation()} style={{maxWidth: '400px'}}>
            <div className="modal-header">
              <h3>Xabar yuborish</h3>
              <button className="close-btn" onClick={() => setShowMessageModal(false)}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSendMessage}>
                <div className="form-group">
                  <label className="form-label">Kimga: {craftsman.shopName || craftsman.name}</label>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    placeholder="Xabaringiz matni..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>Yopish</button>
                  <button type="submit" className="btn btn-primary" disabled={isSendingMessage || !messageText.trim()}>
                    {isSendingMessage ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
