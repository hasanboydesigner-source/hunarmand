import { Link } from 'react-router-dom';
import { CATEGORIES, REGIONS } from '../data/constants';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa6';
import CategoryIcon from './CategoryIcon';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="logo-icon"><span>E</span></div>
            <div className="logo-text">
              <span className="logo-primary">E-Hunarmand</span>
            </div>
          </Link>
          <p className="footer-desc">
            O'zbek an'anaviy hunarmandchiligini dunyoga tanituvchi platforma. Usta qo'llar bilan yaratilgan noyob buyumlar.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" className="social-icon" aria-label="Telegram"><FaTelegram size={18} /></a>
            <a href="#" className="social-icon" aria-label="Facebook"><FaFacebook size={18} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Kategoriyalar</h4>
          <ul>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}><Link to={`/products?category=${c.id}`}><span className="cat-icon-sm"><CategoryIcon name={c.icon} size={14} /></span> {c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Havolalar</h4>
          <ul>
            <li><Link to="/about">Biz haqimizda</Link></li>
            <li><Link to="/craftsmen">Hunarmandlar</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/auth/register?role=craftsman">Hunarmand bo'lish</Link></li>
            <li><Link to="/help">Yordam markazi</Link></li>
            <li><Link to="/privacy">Maxfiylik siyosati</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Bog'lanish</h4>
          <ul>
            <li className="contact-item"><MapPin size={14} /><span>Toshkent, O'zbekiston</span></li>
            <li className="contact-item"><Phone size={14} /><a href="tel:+998712345678">+998 71 234-56-78</a></li>
            <li className="contact-item"><Mail size={14} /><a href="mailto:info@hunarmand.uz">info@hunarmand.uz</a></li>
          </ul>
          <div className="payment-badges">
            <span className="pay-badge">Payme</span>
            <span className="pay-badge">Click</span>
            <span className="pay-badge">Uzcard</span>
            <span className="pay-badge">Humo</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} E-Hunarmand. Barcha huquqlar himoyalangan.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Foydalanish shartlari</Link>
            <Link to="/privacy">Maxfiylik</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
