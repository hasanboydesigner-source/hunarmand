import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store/useStore';
import { formatPrice, API_URL } from '../data/constants';
import { CheckCircle2, ChevronRight, CreditCard, Truck, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Checkout.css';

const STEPS = [
  { id: 1, label: "Manzil", icon: <Truck size={16}/> },
  { id: 2, label: "To'lov", icon: <CreditCard size={16}/> },
  { id: 3, label: "Tasdiqlash", icon: <ClipboardList size={16}/> },
];

const PAYMENT_METHODS = [
  { id: 'payme',  label: 'Payme',   color: '#1db1fd' },
  { id: 'click',  label: 'Click',   color: '#4CAF50' },
  { id: 'uzcard', label: 'Uzcard',  color: '#e84393' },
  { id: 'humo',   label: 'Humo',    color: '#ff6600' },
  { id: 'cod',    label: 'Naqd pul (Yetkazib berganda)', color: '#6b7280' },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('payme');
  const [address, setAddress] = useState({ name:'', phone:'', region:'', city:'', street:'', zip:'' });
  const [delivery, setDelivery] = useState('standard');
  const [ordered, setOrdered] = useState(false);
  const [orderNumbers, setOrderNumbers] = useState([]);

  // Prefill address fields dynamically if user is logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const options = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona', 'Xorazm'];
          
          // Helper to match free-text input region to available select options
          const matchRegion = (rawRegion) => {
            if (!rawRegion) return '';
            const clean = rawRegion.trim().toLowerCase();
            const found = options.find(opt => clean.includes(opt.toLowerCase()) || opt.toLowerCase().includes(clean));
            return found || '';
          };

          // Immediately set initial fallback values from auth state
          setAddress(prev => ({
            ...prev,
            name: prev.name || user.name || '',
            phone: prev.phone || user.phone || '',
            region: prev.region || matchRegion(user.region) || '',
          }));

          // Fetch full profile details from the database
          const { data } = await axios.get(`${API_URL}/auth/users/${user.id}`);
          if (data) {
            setAddress(prev => ({
              ...prev,
              name: prev.name || data.name || user.name || '',
              phone: prev.phone || data.phone || user.phone || '',
              region: prev.region || matchRegion(data.region) || matchRegion(user.region) || '',
              city: prev.city || data.city || '',
              street: prev.street || data.street || data.address || '',
            }));
          }
        } catch (err) {
          console.error("Foydalanuvchi profilini yuklashda xatolik:", err);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const subtotal = items.reduce((s,i) => s + i.price * i.quantity, 0);
  const shipping  = delivery === 'express' ? 60000 : subtotal > 500000 ? 0 : 30000;
  const total     = subtotal + shipping;

  const handleOrder = async () => {
    try {
      // Bitta xaridda har xil hunarmandlar bo'lishi mumkin, ularni guruhlaymiz
      const ordersByCraftsman = {};
      
      items.forEach(item => {
        const craftsmanId = typeof item.craftsman === 'object' ? (item.craftsman._id || item.craftsman.id) : item.craftsman;
        if (!craftsmanId) return; // Hunarmandi yo'q mahsulot bo'lmasligi kerak
        
        if (!ordersByCraftsman[craftsmanId]) {
          ordersByCraftsman[craftsmanId] = { items: [], totalAmount: 0 };
        }
        
        ordersByCraftsman[craftsmanId].items.push({
          product: item._id || item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        });
        ordersByCraftsman[craftsmanId].totalAmount += (item.price * item.quantity);
      });

      const craftsmanIds = Object.keys(ordersByCraftsman);
      if (craftsmanIds.length > 0) {
        // Yetkazib berish narxini birinchi buyurtmaga qo'shamiz (yoki hammaga bo'lib yuborish mumkin)
        ordersByCraftsman[craftsmanIds[0]].totalAmount += shipping;
      }

      // API ga yuborish — response dan real orderNumber ni olamiz
      const results = await Promise.all(
        craftsmanIds.map(cId =>
          axios.post(`${API_URL}/orders`, {
            customer: address,
            customerId: user?.id,
            items: ordersByCraftsman[cId].items,
            craftsmanId: cId,
            totalAmount: ordersByCraftsman[cId].totalAmount,
            paymentMethod: payMethod,
            deliveryMethod: delivery
          })
        )
      );

      const nums = results.map(r => r.data?.orderNumber || r.data?._id?.slice(-6).toUpperCase()).filter(Boolean);
      setOrderNumbers(nums);
      clearCart();
      setOrdered(true);
      toast.success("Buyurtmangiz qabul qilindi! ✅");
      setTimeout(() => navigate('/profile/orders'), 4000);
    } catch (err) {
      console.error(err);
      toast.error("Buyurtma berishda xatolik yuz berdi");
    }
  };

  if (ordered) return (
    <div className="checkout-page page-with-header">
      <div className="order-success">
        <div className="success-icon"><CheckCircle2 size={72} /></div>
        <h1>Buyurtma qabul qilindi!</h1>
        <p>Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Hunarmand tez orada siz bilan bog'lanadi.</p>
        {orderNumbers.map((num, i) => (
          <p key={i} className="order-num">Buyurtma #{num}</p>
        ))}
        <p className="redirect-hint">Buyurtmalar sahifasiga yo'naltirilmoqda...</p>
      </div>
    </div>
  );

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page page-with-header">
      <div className="checkout-header">
        <div className="container">
          <h1>Buyurtma berish</h1>
          <div className="checkout-steps">
            {STEPS.map((s, idx) => (
              <div key={s.id} className={`checkout-step ${step >= s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
                <div className="step-num">{step > s.id ? <CheckCircle2 size={16}/> : s.icon}</div>
                <span>{s.label}</span>
                {idx < STEPS.length-1 && <ChevronRight size={14} className="step-sep"/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container checkout-layout">
        <div className="checkout-main">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="checkout-card animate-fadeIn">
              <h2><Truck size={20}/> Yetkazib berish manzili</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">To'liq ism *</label>
                  <input className="form-input" placeholder="Ism Familiya" value={address.name} onChange={e=>setAddress({...address,name:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon *</label>
                  <input className="form-input" placeholder="+998 XX XXX XX XX" value={address.phone} onChange={e=>setAddress({...address,phone:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Viloyat *</label>
                  <select className="form-input form-select" value={address.region} onChange={e=>setAddress({...address,region:e.target.value})}>
                    <option value="">Tanlang</option>
                    {['Toshkent','Samarqand','Buxoro','Namangan','Andijon','Farg\'ona','Xorazm'].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Shahar / Tuman *</label>
                  <input className="form-input" placeholder="Shahar" value={address.city} onChange={e=>setAddress({...address,city:e.target.value})}/>
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Ko'cha, uy raqami *</label>
                  <input className="form-input" placeholder="Ko'cha va uy raqami" value={address.street} onChange={e=>setAddress({...address,street:e.target.value})}/>
                </div>
              </div>

              <h3 className="section-sub">Yetkazib berish turi</h3>
              <div className="delivery-options">
                {[
                  { id:'standard', label:'Standart (3-5 kun)', price: subtotal>500000?'Bepul':formatPrice(30000) },
                  { id:'express',  label:'Tezkor (1-2 kun)',   price: formatPrice(60000) },
                ].map(d=>(
                  <label key={d.id} className={`delivery-option ${delivery===d.id?'active':''}`}>
                    <input type="radio" name="delivery" checked={delivery===d.id} onChange={()=>setDelivery(d.id)}/>
                    <div className="do-info"><strong>{d.label}</strong><span>{d.price}</span></div>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary btn-lg next-btn"
                onClick={()=>{if(!address.name||!address.phone||!address.region||!address.city||!address.street){toast.error("Barcha maydonlarni to'ldiring");return;}setStep(2);}}>
                Keyingisi — To'lov <ChevronRight size={16}/>
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="checkout-card animate-fadeIn">
              <h2><CreditCard size={20}/> To'lov usuli</h2>
              <div className="payment-options">
                {PAYMENT_METHODS.map(m=>(
                  <label key={m.id} className={`payment-option ${payMethod===m.id?'active':''}`}>
                    <input type="radio" name="pay" checked={payMethod===m.id} onChange={()=>setPayMethod(m.id)}/>
                    <div className="po-dot" style={{background:m.color}}/>
                    <span>{m.label}</span>
                    {payMethod===m.id && <CheckCircle2 size={16} className="po-check"/>}
                  </label>
                ))}
              </div>
              {payMethod !== 'cod' && (
                <div className="card-fields form-grid">
                  <div className="form-group span-2">
                    <label className="form-label">Karta raqami</label>
                    <input className="form-input" placeholder="0000 0000 0000 0000" maxLength={19}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amal qilish muddati</label>
                    <input className="form-input" placeholder="MM/YY"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMS kod</label>
                    <input className="form-input" placeholder="- - - - - -"/>
                  </div>
                </div>
              )}
              <div className="step-nav">
                <button className="btn btn-secondary" onClick={()=>setStep(1)}>Orqaga</button>
                <button className="btn btn-primary btn-lg" onClick={()=>setStep(3)}>
                  Tasdiqlash <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="checkout-card animate-fadeIn">
              <h2><ClipboardList size={20}/> Buyurtmani tasdiqlash</h2>
              <div className="review-section">
                <h4>Manzil</h4>
                <p>{address.name} • {address.phone}</p>
                <p>{address.region}, {address.city}, {address.street}</p>
              </div>
              <div className="review-section">
                <h4>To'lov usuli</h4>
                <p>{PAYMENT_METHODS.find(m=>m.id===payMethod)?.label}</p>
              </div>
              <div className="review-section">
                <h4>Mahsulotlar ({items.reduce((s,i)=>s+i.quantity,0)} ta)</h4>
                {items.map(i=>(
                  <div key={i.key} className="review-item-row">
                    <img src={i.image} alt={i.title} className="review-item-img"/>
                    <span className="review-item-title">{i.title} ×{i.quantity}</span>
                    <strong>{formatPrice(i.price*i.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="step-nav">
                <button className="btn btn-secondary" onClick={()=>setStep(2)}>Orqaga</button>
                <button className="btn btn-primary btn-lg" onClick={handleOrder}>
                  <CheckCircle2 size={16}/> Buyurtma berish — {formatPrice(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="checkout-summary">
          <h3>Buyurtma</h3>
          {items.map(i=>(
            <div key={i.key} className="co-item">
              <img src={i.image} alt={i.title} className="co-item-img"/>
              <div className="co-item-info">
                <p>{i.title}</p>
                <span>×{i.quantity}</span>
              </div>
              <strong>{formatPrice(i.price*i.quantity)}</strong>
            </div>
          ))}
          <div className="co-divider"/>
          <div className="co-line"><span>Mahsulotlar</span><span>{formatPrice(subtotal)}</span></div>
          <div className="co-line"><span>Yetkazib berish</span><span className={shipping===0?'free':''}>{shipping===0?'Bepul':formatPrice(shipping)}</span></div>
          <div className="co-divider"/>
          <div className="co-total"><span>Jami</span><strong>{formatPrice(total)}</strong></div>
        </div>
      </div>
    </div>
  );
}
