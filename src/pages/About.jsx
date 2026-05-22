import { Link } from 'react-router-dom';
import { GiPaintedPottery } from 'react-icons/gi';
import { ShieldCheck, Users, Globe, Heart, MapPin, Mail, Phone, ArrowRight, Star } from 'lucide-react';
import './About.css';

const TEAM = [
  { name: 'Jasur Karimov', role: 'Asoschisi & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', region: 'Toshkent' },
  { name: 'Nilufar Rashidova', role: 'Mahsulot direktori', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', region: 'Samarqand' },
  { name: 'Bobur Toshmatov', role: 'Texnologiyalar direktori', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', region: 'Buxoro' },
];

const VALUES = [
  { icon: <ShieldCheck size={24} />, title: 'Sifat kafolati', desc: 'Har bir mahsulot haqiqiy hunarmand tomonidan qo\'lda yasalgan va sifati tekshirilgan.' },
  { icon: <Heart size={24} />, title: 'An\'anani asrash', desc: 'Yuz yillik hunarmandchilik san\'atini kelajak avlodlarga yetkazishga harakat qilamiz.' },
  { icon: <Users size={24} />, title: 'Hunarmandlarni qo\'llash', desc: 'To\'g\'ridan-to\'g\'ri savdo orqali hunarmandlarga adolatli daromad ta\'minlaymiz.' },
  { icon: <Globe size={24} />, title: 'Global bozor', desc: 'O\'zbek hunarmandchiligini butun dunyo bozorlariga olib chiqish maqsadida ishlaymiz.' },
];

const STATS = [
  { value: '200+', label: 'Hunarmand' },
  { value: '1,500+', label: 'Mahsulot' },
  { value: '12,000+', label: 'Buyurtma' },
  { value: '4.9', label: 'O\'rtacha reyting', suffix: '★' },
];

export default function AboutPage() {
  return (
    <div className="about-page page-with-header">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container about-hero-content">
          <div className="about-logo-icon"><span>E</span></div>
          <span className="eyebrow">Bizning Hikoyamiz</span>
          <h1>E-Hunarmand</h1>
          <p>O'zbekistonning boy hunarmandchilik merosini zamonaviy texnologiyalar orqali butun dunyoga taqdim etuvchi platforma</p>
          <div className="about-hero-actions">
            <Link to="/products" className="btn btn-primary">Mahsulotlarni ko'rish <ArrowRight size={15} /></Link>
            <Link to="/craftsmen" className="btn btn-ghost btn-outline-white">Hunarmandlar <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container about-stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="about-stat-card">
              <strong>{s.value}{s.suffix}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="container about-mission-inner">
          <div className="about-mission-text">
            <span className="eyebrow">Bizning maqsadimiz</span>
            <h2>O'zbek hunarmandchiligini<br />dunyoga tanitamiz</h2>
            <p>
              2020-yilda tashkil etilgan E-Hunarmand O'zbekistonning turli burchaklaridagi mohir ustalarni
              xaridorlar bilan to'g'ridan-to'g'ri bog'laydigan platforma hisoblanadi.
            </p>
            <p>
              Biz har bir hunarmandning noyob mahoratini qadrlаb, ularning san'atini saqlab qolish va
              rivojlantirish uchun raqamli muhit yaratdik. Platforma orqali xaridor haqiqiy, qo'lda
              yasalgan mahsulotlarni bevosita ustadan sotib oladi — vositachilarsiz.
            </p>
            <Link to="/craftsmen" className="btn btn-primary btn-sm">Hunarmandlarni toping <ArrowRight size={14} /></Link>
          </div>
          <div className="about-mission-img">
            <img src="https://tbc-ornaments.uz/wp-content/uploads/2021/11/1O5A4035@2x-1.jpg" alt="Pottery craftsman at work" />
            <div className="about-mission-badge">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <strong>4.9</strong>
              <span>12,000+ xaridor bahosi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-header-center">
            <span className="eyebrow">Qadriyatlarimiz</span>
            <h2>Nima uchun E-Hunarmand?</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="container">
          <div className="section-header-center">
            <span className="eyebrow">Jamoa</span>
            <h2>Bizning jamoa</h2>
          </div>
          <div className="about-team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="about-team-card">
                <img src={m.img} alt={m.name} className="about-team-img" />
                <h3>{m.name}</h3>
                <p className="about-team-role">{m.role}</p>
                <span className="about-team-region"><MapPin size={12} /> {m.region}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="about-contact">
        <div className="container about-contact-inner">
          <div className="section-header-center">
            <span className="eyebrow">Bog'lanish</span>
            <h2>Biz bilan muloqot qiling</h2>
          </div>
          <div className="about-contact-grid">
            <div className="about-contact-card">
              <Mail size={22} />
              <h4>Email</h4>
              <p>info@ehunarmand.uz</p>
            </div>
            <div className="about-contact-card">
              <Phone size={22} />
              <h4>Telefon</h4>
              <p>+998 71 123 45 67</p>
            </div>
            <div className="about-contact-card">
              <MapPin size={22} />
              <h4>Manzil</h4>
              <p>Toshkent sh., Yunusobod tumani</p>
            </div>
          </div>
          <div className="about-cta">
            <Link to="/auth/register" className="btn btn-primary">Hunarmand sifatida qo'shiling <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
