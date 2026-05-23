import { Link } from 'react-router-dom';
import { GiPaintedPottery } from 'react-icons/gi';
import { ShieldCheck, Users, Globe, Heart, MapPin, Mail, Phone, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './About.css';

export default function AboutPage() {
  const { t } = useTranslation();

  const TEAM = [
    { name: 'Jasur Karimov', role: t('about.role_ceo'), img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', region: 'Toshkent' },
    { name: 'Nilufar Rashidova', role: t('about.role_product'), img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', region: 'Samarqand' },
    { name: 'Bobur Toshmatov', role: t('about.role_tech'), img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', region: 'Buxoro' },
  ];

  const VALUES = [
    { icon: <ShieldCheck size={24} />, title: t('about.val1_title'), desc: t('about.val1_desc') },
    { icon: <Heart size={24} />, title: t('about.val2_title'), desc: t('about.val2_desc') },
    { icon: <Users size={24} />, title: t('about.val3_title'), desc: t('about.val3_desc') },
    { icon: <Globe size={24} />, title: t('about.val4_title'), desc: t('about.val4_desc') },
  ];

  const STATS = [
    { value: '200+', label: t('about.stat1') },
    { value: '1,500+', label: t('about.stat2') },
    { value: '12,000+', label: t('about.stat3') },
    { value: '4.9', label: t('about.stat4'), suffix: '★' },
  ];

  return (
    <div className="about-page page-with-header">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container about-hero-content">
          <span className="eyebrow">{t('about.story')}</span>
          <h1>E-Hunarmand</h1>
          <p>{t('about.desc')}</p>
          <div className="about-hero-actions">
            <Link to="/products" className="btn btn-primary">{t('about.view_products')} <ArrowRight size={15} /></Link>
            <Link to="/craftsmen" className="btn btn-ghost btn-outline-white">{t('about.craftsmen')} <ArrowRight size={15} /></Link>
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
            <span className="eyebrow">{t('about.mission_eyebrow')}</span>
            <h2>{t('about.mission_title')}</h2>
            <p>
              {t('about.mission_p1')}
            </p>
            <p>
              {t('about.mission_p2')}
            </p>
            <Link to="/craftsmen" className="btn btn-primary btn-sm">{t('about.find_craftsmen')} <ArrowRight size={14} /></Link>
          </div>
          <div className="about-mission-img">
            <img src="https://tbc-ornaments.uz/wp-content/uploads/2021/11/1O5A4035@2x-1.jpg" alt="Pottery craftsman at work" />
            <div className="about-mission-badge">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <strong>4.9</strong>
              <span>12,000+ {t('about.buyer_score')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-header-center">
            <span className="eyebrow">{t('about.values_eyebrow')}</span>
            <h2>{t('about.values_title')}</h2>
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
            <span className="eyebrow">{t('about.team_eyebrow')}</span>
            <h2>{t('about.team_title')}</h2>
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
            <span className="eyebrow">{t('about.contact_eyebrow')}</span>
            <h2>{t('about.contact_title')}</h2>
          </div>
          <div className="about-contact-grid">
            <div className="about-contact-card">
              <Mail size={22} />
              <h4>{t('about.email')}</h4>
              <p>info@ehunarmand.uz</p>
            </div>
            <div className="about-contact-card">
              <Phone size={22} />
              <h4>{t('about.phone')}</h4>
              <p>+998 71 123 45 67</p>
            </div>
            <div className="about-contact-card">
              <MapPin size={22} />
              <h4>{t('about.address')}</h4>
              <p>{t('about.address_val')}</p>
            </div>
          </div>
          <div className="about-cta">
            <Link to="/auth/register" className="btn btn-primary">{t('about.join_craftsman')} <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
