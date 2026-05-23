import { useState } from 'react';
import { REGIONS } from '../../data/constants';

export default function DashboardSettings({ profile, handleSaveProfile, handleSaveShop, addToast }) {
  const [localProfile, setLocalProfile] = useState(profile || {
    name: '', email: '', phone: '', shopName: '', category: '', region: '', bio: '', yearsExp: 0
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const onProfileSubmit = (e) => {
    e.preventDefault();
    handleSaveProfile && handleSaveProfile(localProfile);
  };

  const onShopSubmit = (e) => {
    e.preventDefault();
    handleSaveShop && handleSaveShop(localProfile);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      addToast && addToast("Barcha parollarni kiriting!", 'error'); return;
    }
    if (passwords.new !== passwords.confirm) {
      addToast && addToast("Yangi parollar mos kelmadi!", 'error'); return;
    }
    if (passwords.new.length < 6) {
      addToast && addToast("Parol kamida 6 belgidan iborat bo'lsin!", 'error'); return;
    }
    addToast && addToast("Parol muvaffaqiyatli yangilandi!", 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Sozlamalar</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Shaxsiy va do'kon ma'lumotlarini tahrirlash</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Personal Info */}
        <form className="ds-card" onSubmit={onProfileSubmit}>
          <h3>Shaxsiy ma'lumotlar</h3>
          <div className="form-group">
            <label className="form-label">To'liq ism</label>
            <input type="text" className="form-input" value={localProfile.name || ''} onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Email manzil</label>
            <input type="email" className="form-input" value={localProfile.email || ''} onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Telefon raqam</label>
            <input type="tel" className="form-input" placeholder="+998 90 123 45 67" value={localProfile.phone || ''} onChange={e => setLocalProfile({ ...localProfile, phone: e.target.value })}/>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>O'zgarishlarni saqlash</button>
        </form>

        {/* Shop Settings */}
        <form className="ds-card" onSubmit={onShopSubmit}>
          <h3>Do'kon sozlamalari</h3>
          <div className="form-group">
            <label className="form-label">Do'kon nomi</label>
            <input type="text" className="form-input" value={localProfile.shopName || ''} onChange={e => setLocalProfile({ ...localProfile, shopName: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Mutaxassislik (Kategoriya)</label>
            <input type="text" className="form-input" placeholder="Keramika" value={localProfile.category || ''} onChange={e => setLocalProfile({ ...localProfile, category: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Viloyat</label>
            <select className="form-input form-select" value={localProfile.region || ''} onChange={e => setLocalProfile({ ...localProfile, region: e.target.value })}>
              <option value="">Tanlang...</option>
              {(REGIONS || ['Toshkent','Samarqand','Buxoro','Namangan','Andijon','Farg\'ona','Xorazm','Surxondaryo','Qashqadaryo','Jizzax','Sirdaryo','Navoiy']).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Yil tajriba (necha yillik tajribangiz bor?)</label>
            <input type="number" className="form-input" min="0" value={localProfile.yearsExp || 0} onChange={e => setLocalProfile({ ...localProfile, yearsExp: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">O'zingiz haqingizda (Bio)</label>
            <textarea className="form-input" rows="3" value={localProfile.bio || ''} onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })}/>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Do'konni yangilash</button>
        </form>

        {/* Security */}
        <form className="ds-card" onSubmit={handleUpdatePassword}>
          <h3>Xavfsizlik (Parolni o'zgartirish)</h3>
          <div className="form-group">
            <label className="form-label">Joriy parol</label>
            <input type="password" className="form-input" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Yangi parol</label>
            <input type="password" className="form-input" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}/>
          </div>
          <div className="form-group">
            <label className="form-label">Yangi parolni takrorlang</label>
            <input type="password" className="form-input" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}/>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>Parolni yangilash</button>
        </form>
      </div>
    </div>
  );
}
