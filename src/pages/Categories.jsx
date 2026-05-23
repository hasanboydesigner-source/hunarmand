import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, MOCK_PRODUCTS, API_URL } from '../data/constants';
import CategoryIcon from '../components/CategoryIcon';
import axios from 'axios';
import { ArrowRight, Package } from 'lucide-react';
import './Categories.css';

const CATEGORY_META = {
  keramika:        { desc: "Rishton, Farg'ona va boshqa viloyatlarning rang-barang loy idishlari", img: 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg' },
  gilam:           { desc: "Buxoro, Xiva va Samarqandning an'anaviy ipak va jun gilamlari",       img: 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg' },
  zargarlik:       { desc: "Kumush va oltin bilan bezatilgan milliy zargarlik buyumlari",           img: 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp' },
  yogoch:          { desc: "Yong'oq va tut yog'ochidan o'yilgan naqshli devoriy panellar",         img: 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg' },
  'toʻqimachilik': { desc: "Marg'ilon atlas va adras, Buxoro shoyi — tabiiy ipak matolar",         img: 'https://images.uzum.uz/d2qt9334eu2h0tmq2smg/original.jpg' },
  naqqoshlik:      { desc: "Buxoro miniatura rasmlari va devoriy naqshlar, tabiiy bo'yoqlar",      img: 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg' },
  misgarlik:       { desc: "Chust va Qo'qon mis ustalarining qo'l ishlari — samovar, idishlar",    img: 'https://api.society.uz/media/news/BQ8A4028.webp' },
  kandakorlik:     { desc: "Xiva va Buxoro an'anaviy o'ymakorlik — sandiqcha, lavhalar",           img: 'https://silkgranat.uz/wp-content/uploads/2025/01/uzbekskaya-reznaya-shkatulka-uzbek-carved-box.webp' },
};

export default function CategoriesPage() {
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
          <span className="eyebrow">Hunarmandchilik yo'nalishlari</span>
          <h1>Kategoriyalar</h1>
          <p>O'zbekistonning boy hunarmandchilik an'analarini 8 ta asosiy yo'nalish orqali kashf eting</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="cat-stats-bar">
        <div className="container cat-stats-inner">
          <div className="cat-stat"><strong>{CATEGORIES.length}</strong><span>Kategoriya</span></div>
          <div className="cat-stat"><strong>{products.length}+</strong><span>Mahsulot</span></div>
          <div className="cat-stat"><strong>4</strong><span>Hunarmand</span></div>
          <div className="cat-stat"><strong>8+</strong><span>Viloyat</span></div>
        </div>
      </div>

      {/* Grid */}
      <div className="container cat-grid-wrap">
        <div className="cat-grid">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat.id] || {};
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
                  <img src={meta.img} alt={cat.label} className="cat-card-img" />
                  <div className="cat-card-overlay" />
                  <div className="cat-card-icon-wrap" style={{ background: cat.color + '22', borderColor: cat.color + '44' }}>
                    <span style={{ color: cat.color }}>
                      <CategoryIcon name={cat.icon} size={28} />
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="cat-card-body">
                  <h3>{cat.label}</h3>
                  <p>{meta.desc}</p>
                  <div className="cat-card-footer">
                    <span className="cat-product-count">
                      <Package size={13} /> {count} ta mahsulot
                    </span>
                    <span className="cat-explore">
                      Ko'rish <ArrowRight size={14} />
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
