import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, MOCK_PRODUCTS, API_URL } from '../data/constants';
import CategoryIcon from '../components/CategoryIcon';
import axios from 'axios';
import { ArrowRight, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Categories.css';

const CATEGORY_META = {
  keramika:        { img: 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg' },
  gilam:           { img: 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg' },
  zargarlik:       { img: 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp' },
  yogoch:          { img: 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg' },
  'toʻqimachilik': { img: 'https://images.uzum.uz/d2qt9334eu2h0tmq2smg/original.jpg' },
  naqqoshlik:      { img: 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg' },
  misgarlik:       { img: 'https://api.society.uz/media/news/BQ8A4028.webp' },
  kandakorlik:     { img: 'https://silkgranat.uz/wp-content/uploads/2025/01/uzbekskaya-reznaya-shkatulka-uzbek-carved-box.webp' },
};

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(err => console.error("Xatolik:", err));
  }, []);

  return (
    <div className="categories-page page-with-header">
      {/* Hero */}
      <div className="cat-hero">
        <div className="container">
          <span className="eyebrow">{t('categories_page.eyebrow')}</span>
          <h1>{t('categories_page.title')}</h1>
          <p>{t('categories_page.subtitle')}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="cat-stats-bar">
        <div className="container cat-stats-inner">
          <div className="cat-stat"><strong>{CATEGORIES.length}</strong><span>{t('categories_page.stat_category')}</span></div>
          <div className="cat-stat"><strong>{products.length}+</strong><span>{t('categories_page.stat_product')}</span></div>
          <div className="cat-stat"><strong>4</strong><span>{t('categories_page.stat_craftsman')}</span></div>
          <div className="cat-stat"><strong>8+</strong><span>{t('categories_page.stat_region')}</span></div>
        </div>
      </div>

      {/* Grid */}
      <div className="container cat-grid-wrap">
        <div className="cat-grid">
          {CATEGORIES.map((cat) => {
            const count = products.filter(p => {
              const pCat = p.category?.toLowerCase() || '';
              const matchedCategory = CATEGORIES.find(c => 
                c.id === pCat || c.label.toLowerCase() === pCat
              );
              return (matchedCategory ? matchedCategory.id : pCat) === cat.id;
            }).length;
            
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="cat-card"
              >
                {/* Cover image */}
                <div className="cat-card-img-wrap">
                  {/* Provide fallback for img since CATEGORY_META is removed from constants later maybe? We should keep img logic */}
                  <img src={CATEGORY_META[cat.id]?.img} alt={t(`categories_data.${cat.id}.label`, { defaultValue: cat.label })} className="cat-card-img" />
                  <div className="cat-card-overlay" />
                  <div className="cat-card-icon-wrap" style={{ background: cat.color + '22', borderColor: cat.color + '44' }}>
                    <span style={{ color: cat.color }}>
                      <CategoryIcon name={cat.icon} size={28} />
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="cat-card-body">
                  <h3>{t(`categories_data.${cat.id}.label`, { defaultValue: cat.label })}</h3>
                  <p>{t(`categories_data.${cat.id}.desc`, { defaultValue: '' })}</p>
                  <div className="cat-card-footer">
                    <span className="cat-product-count">
                      <Package size={13} /> {t('categories_page.products_count', { count })}
                    </span>
                    <span className="cat-explore">
                      {t('categories_page.view')} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
