import { useState } from 'react';
import { User, Store, Shield, Save, Eye, EyeOff, ChevronRight, MapPin, Phone, Mail, Clock, FileText, Tag } from 'lucide-react';
import { REGIONS } from '../../data/constants';

const TABS = [
  { id: 'profile', label: 'Shaxsiy', icon: User },
  { id: 'shop',    label: "Do'kon",  icon: Store },
  { id: 'security',label: 'Xavfsizlik', icon: Shield },
];

const FieldGroup = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 7 }}>
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ icon: Icon, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }}>
        <Icon size={15} />
      </div>
    )}
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: Icon ? '11px 14px 11px 38px' : '11px 14px',
        borderRadius: 10, border: '1.5px solid #e5e7eb',
        fontSize: 14, color: '#111', background: '#fafafa',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        outline: 'none',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#c97a22'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(201,122,34,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

const Select = ({ icon: Icon, children, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && (
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none', zIndex: 1 }}>
        <Icon size={15} />
      </div>
    )}
    <select
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: Icon ? '11px 14px 11px 38px' : '11px 14px',
        borderRadius: 10, border: '1.5px solid #e5e7eb',
        fontSize: 14, color: '#111', background: '#fafafa',
        appearance: 'none', cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        outline: 'none',
      }}
      onFocus={e => { e.target.style.borderColor = '#c97a22'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(201,122,34,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
    >
      {children}
    </select>
    <ChevronRight size={14} color="#bbb" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
  </div>
);

export default function DashboardSettings({ profile, handleSaveProfile, handleSaveShop, addToast }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [localProfile, setLocalProfile] = useState(profile || {
    name: '', email: '', phone: '', shopName: '', category: '', region: '', bio: '', yearsExp: 0
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const initials = (localProfile.name || 'H').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await handleSaveProfile?.(localProfile);
    setSaving(false);
  };

  const onShopSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await handleSaveShop?.(localProfile);
    setSaving(false);
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      addToast?.("Barcha maydonlarni to'ldiring!", 'error'); return;
    }
    if (passwords.new !== passwords.confirm) {
      addToast?.("Yangi parollar mos kelmadi!", 'error'); return;
    }
    if (passwords.new.length < 6) {
      addToast?.("Parol kamida 6 belgidan iborat bo'lsin!", 'error'); return;
    }
    addToast?.("Parol muvaffaqiyatli yangilandi!", 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>Sozlamalar</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Profil va do'kon ma'lumotlarini boshqaring</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Avatar card */}
          <div style={{
            background: '#fff', border: '1px solid #f0f0f0',
            borderRadius: 18, padding: '24px 16px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c97a22, #e8962a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', fontSize: 26, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 16px rgba(201,122,34,0.3)',
              letterSpacing: '-1px',
            }}>
              {initials}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{localProfile.name || 'Hunarmand'}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{localProfile.shopName || "Do'kon nomi"}</div>
            {localProfile.region && (
              <div style={{ fontSize: 12, color: '#c97a22', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MapPin size={11} /> {localProfile.region}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{
            background: '#fff', border: '1px solid #f0f0f0',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '13px 18px', border: 'none', cursor: 'pointer',
                    background: isActive ? '#fff8ed' : 'transparent',
                    color: isActive ? '#c97a22' : '#666',
                    fontSize: 14, fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s',
                    borderLeft: isActive ? '3px solid #c97a22' : '3px solid transparent',
                    borderBottom: i < TABS.length - 1 ? '1px solid #f5f5f5' : 'none',
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right content ── */}
        <div style={{
          background: '#fff', border: '1px solid #f0f0f0',
          borderRadius: 18, padding: '28px 32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <form onSubmit={onProfileSubmit}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111', margin: 0 }}>Shaxsiy ma'lumotlar</h2>
                <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Ism, email va telefon raqamingizni yangilang</p>
              </div>
              <FieldGroup label="To'liq ism">
                <Input icon={User} type="text" placeholder="Ism Familiya" value={localProfile.name || ''} onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Email manzil">
                <Input icon={Mail} type="email" placeholder="email@example.com" value={localProfile.email || ''} onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Telefon raqam">
                <Input icon={Phone} type="tel" placeholder="+998 90 123 45 67" value={localProfile.phone || ''} onChange={e => setLocalProfile({ ...localProfile, phone: e.target.value })} />
              </FieldGroup>
              <div style={{ paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
                <button
                  type="submit" disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: saving ? '#f5f5f5' : 'linear-gradient(135deg, #c97a22, #e8962a)',
                    color: saving ? '#aaa' : '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: saving ? 'none' : '0 4px 14px rgba(201,122,34,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
                </button>
              </div>
            </form>
          )}

          {/* ── Shop Tab ── */}
          {activeTab === 'shop' && (
            <form onSubmit={onShopSubmit}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111', margin: 0 }}>Do'kon sozlamalari</h2>
                <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Do'kon profili xaridorlar tomonidan ko'rinadi</p>
              </div>
              <FieldGroup label="Do'kon nomi">
                <Input icon={Store} type="text" placeholder="Masalan: Rishton Keramika" value={localProfile.shopName || ''} onChange={e => setLocalProfile({ ...localProfile, shopName: e.target.value })} />
              </FieldGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FieldGroup label="Mutaxassislik">
                  <Input icon={Tag} type="text" placeholder="Keramika" value={localProfile.category || ''} onChange={e => setLocalProfile({ ...localProfile, category: e.target.value })} />
                </FieldGroup>
                <FieldGroup label="Tajriba (yil)">
                  <Input icon={Clock} type="number" min="0" max="60" value={localProfile.yearsExp || 0} onChange={e => setLocalProfile({ ...localProfile, yearsExp: e.target.value })} />
                </FieldGroup>
              </div>
              <FieldGroup label="Viloyat">
                <Select icon={MapPin} value={localProfile.region || ''} onChange={e => setLocalProfile({ ...localProfile, region: e.target.value })}>
                  <option value="">Tanlang...</option>
                  {(REGIONS || [
                    "Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon",
                    "Farg'ona", "Xorazm", "Surxondaryo", "Qashqadaryo", "Jizzax", "Sirdaryo", "Navoiy"
                  ]).map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup label="O'zingiz haqingizda (Bio)">
                <div style={{ position: 'relative' }}>
                  <FileText size={15} color="#bbb" style={{ position: 'absolute', left: 14, top: 14, pointerEvents: 'none' }} />
                  <textarea
                    rows={4}
                    placeholder="Do'koningiz va hunarmandchilik tajribangiz haqida yozing..."
                    value={localProfile.bio || ''}
                    onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '11px 14px 11px 38px',
                      borderRadius: 10, border: '1.5px solid #e5e7eb',
                      fontSize: 14, color: '#111', background: '#fafafa',
                      resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                      outline: 'none', transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#c97a22'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(201,122,34,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </FieldGroup>
              <div style={{ paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
                <button
                  type="submit" disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: saving ? '#f5f5f5' : 'linear-gradient(135deg, #c97a22, #e8962a)',
                    color: saving ? '#aaa' : '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: saving ? 'none' : '0 4px 14px rgba(201,122,34,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saqlanmoqda...' : "Do'konni yangilash"}
                </button>
              </div>
            </form>
          )}

          {/* ── Security Tab ── */}
          {activeTab === 'security' && (
            <form onSubmit={onPasswordSubmit}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111', margin: 0 }}>Xavfsizlik</h2>
                <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Hisobingiz xavfsizligi uchun kuchli parol ishlatng</p>
              </div>

              {/* Security tips */}
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12,
                padding: '14px 16px', marginBottom: 24,
                fontSize: 13, color: '#166534', lineHeight: 1.6,
              }}>
                <strong>💡 Kuchli parol uchun:</strong> Kamida 8 ta belgi, son, katta va kichik harf ishlatng.
              </div>

              {[
                { key: 'current', label: 'Joriy parol', placeholder: 'Joriy parolni kiriting' },
                { key: 'new', label: 'Yangi parol', placeholder: 'Yangi parolni kiriting (kamida 6 belgi)' },
                { key: 'confirm', label: 'Yangi parolni tasdiqlang', placeholder: 'Yangi parolni qaytaring' },
              ].map(field => (
                <FieldGroup key={field.key} label={field.label}>
                  <div style={{ position: 'relative' }}>
                    <Shield size={15} color="#bbb" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type={showPw[field.key] ? 'text' : 'password'}
                      placeholder={field.placeholder}
                      value={passwords[field.key]}
                      onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '11px 44px 11px 38px',
                        borderRadius: 10, border: '1.5px solid #e5e7eb',
                        fontSize: 14, color: '#111', background: '#fafafa',
                        outline: 'none', transition: 'all 0.2s',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#c97a22'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(201,122,34,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => ({ ...p, [field.key]: !p[field.key] }))}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4,
                      }}
                    >
                      {showPw[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FieldGroup>
              ))}

              <div style={{ paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Shield size={16} />
                  Parolni yangilash
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
