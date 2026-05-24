import { Link } from 'react-router-dom';
import { CATEGORIES, REGIONS } from '../data/constants';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa6';
import CategoryIcon from './CategoryIcon';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="logo-icon"><img src="/new.png" alt="E-Hunarmand" className="logo-img" /></div>
          </Link>
          <p className="footer-desc">
            {t('footer.desc')}
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" className="social-icon" aria-label="Telegram"><FaTelegram size={18} /></a>
            <a href="#" className="social-icon" aria-label="Facebook"><FaFacebook size={18} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>{t('nav.categories')}</h4>
          <ul>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}><Link to={`/products?category=${c.id}`}><span className="cat-icon-sm"><CategoryIcon name={c.icon} size={14} /></span> {c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>{t('footer.links')}</h4>
          <ul>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/craftsmen">{t('nav.craftsmen')}</Link></li>
            <li><Link to="/blog">{t('footer.blog')}</Link></li>
            <li><Link to="/auth/register?role=craftsman">{t('footer.become_craftsman')}</Link></li>
            <li><Link to="/help">{t('footer.help')}</Link></li>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li className="contact-item"><MapPin size={14} /><span>Namangan viloyati, Chust tumani</span></li>
            <li className="contact-item"><Phone size={14} /><a href="tel:+998943715271">+998 94 371-52-71</a></li>
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
          <p>© {year} E-Hunarmand. {t('footer.rights')}</p>
          <div className="footer-bottom-links">
            <Link to="/terms">{t('footer.terms')}</Link>
            <Link to="/privacy">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
