import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../data/constants';
import { ShieldCheck, CheckCircle, MapPin, Calendar, User, Info, ArrowLeft, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './CertificateVerify.css';

export default function CertificateVerify() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(`${API_URL}/certificates/${id}`);
        setCert(response.data);
        setError(null);
      } catch (err) {
        setError('Sertifikat topilmadi yoku tizimda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="cert-verify-page loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="cert-verify-page error">
        <div className="cert-error-box">
          <Info size={48} color="#ef4444" />
          <h2>Xatolik</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary mt-4">Bosh sahifaga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cert-verify-page">
      <div className="cert-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> E-Hunarmand
        </Link>
      </div>
      
      <div className="container">
        <div className="cert-card-wrapper">
          <div className="cert-card">
            {/* Background Pattern */}
            <div className="cert-bg-pattern"></div>
            
            <div className="cert-top">
              <div className="cert-logo-wrap">
                <span className="cert-logo-text">E-Hunarmand</span>
                <span className="cert-logo-sub">Milliy Meros</span>
              </div>
              <div className="cert-badge">
                <ShieldCheck size={20} />
                <span>TASDIQLANGAN</span>
              </div>
            </div>

            <div className="cert-body">
              <h1 className="cert-title">Haqiqiylik Sertifikati</h1>
              <p className="cert-desc">
                Ushbu sertifikat quyida ko'rsatilgan mahsulotning sof o'zbek milliy hunarmandchilik asari ekanligini, qo'l mehnati bilan yaratilganini va rasmiy ravishda tasdiqlangan ustaga tegishli ekanligini kafolatlaydi.
              </p>

              <div className="cert-product-info">
                {cert.orderItemImage && (
                  <div className="cert-image">
                    <img src={cert.orderItemImage} alt={cert.orderItemTitle} />
                  </div>
                )}
                <div className="cert-details">
                  <h3>{cert.orderItemTitle}</h3>
                  <div className="cert-meta-list">
                    <div className="cert-meta-item">
                      <User size={16} />
                      <div>
                        <span className="meta-label">Xaridor:</span>
                        <span className="meta-val">{cert.ownerName}</span>
                      </div>
                    </div>
                    <div className="cert-meta-item">
                      <Calendar size={16} />
                      <div>
                        <span className="meta-label">Berilgan sana:</span>
                        <span className="meta-val">{new Date(cert.issuedAt).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cert-divider"></div>

              <div className="cert-craftsman-info">
                <div className="cc-avatar">
                  {cert.craftsman?.avatar ? (
                    <img src={cert.craftsman.avatar} alt="Avatar" />
                  ) : (
                    <span>{(cert.craftsman?.shopName || cert.craftsman?.name || 'U').charAt(0)}</span>
                  )}
                </div>
                <div className="cc-details">
                  <h4>Yaratuvchi Usta</h4>
                  <p className="cc-name">{cert.craftsman?.shopName || cert.craftsman?.name}</p>
                  <span className="cc-region"><MapPin size={12}/> {cert.craftsman?.region || 'O\'zbekiston'}</span>
                </div>
                <div className="cc-stamp">
                  <div className="stamp-circle">
                    <span>SEAL OF<br/>AUTHENTICITY</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cert-footer">
              <div className="cert-id-box">
                <span className="cid-label">CERTIFICATE ID</span>
                <span className="cid-value">{cert.certificateId}</span>
              </div>
              <div className="cert-verification-text">
                Ushbu sertifikat E-Hunarmand markaziy bazasida saqlanadi. <br/>
                Sertifikatni istalgan vaqt e-hunarmand.uz/verify/{cert.certificateId} orqali tekshirish mumkin.
              </div>
            </div>
          </div>

          <div className="cert-actions">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Download size={18} /> PDF yuklab olish / Chop etish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
