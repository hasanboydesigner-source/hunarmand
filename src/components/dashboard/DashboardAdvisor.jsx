import { useState } from 'react';
import axios from 'axios';
import { Sparkles, TrendingUp, AlertCircle, ShoppingBag, PackageOpen, Bot } from 'lucide-react';
import { API_URL } from '../../data/constants';
import ReactMarkdown from 'react-markdown';
import './DashboardAdvisor.css';

export default function DashboardAdvisor({ user }) {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvice = async () => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/advisor/${userId}`);
      setAdvice(data.advice);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Maslahatchi bilan bog\'lanishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dash-advisor">
      <div className="dash-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bot size={28} color="#c97a22" /> AI Biznes Maslahatchi</h2>
          <p>Savdolaringizni oshirish va biznesingizni rivojlantirish uchun shaxsiy sun'iy intellekt maslahatchisi</p>
        </div>
      </div>

      <div className="advisor-content">
        <div className="advisor-intro card">
          <div className="advisor-icon-wrapper">
            <Sparkles size={32} color="#c97a22" />
          </div>
          <h3>AI tahlil qilishga tayyor!</h3>
          <p>
            Men sizning barcha mahsulotlaringizni, ularning necha marta ko'rilgani, qancha sotilgani, ombordagi zaxirasi va xaridorlarning qoldirgan izohlarini tahlil qilaman. So'ngra sizga savdoni oshirish bo'yicha eng yaxshi biznes strategiyalarni taklif qilaman.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={fetchAdvice}
            disabled={isLoading}
            style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Tahlil qilinmoqda...
              </>
            ) : (
              <>
                <TrendingUp size={18} />
                Tahlilni boshlash
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="advisor-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {advice && (
          <div className="advisor-result card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Sparkles size={24} color="#16a34a" /> 
              Tahlil Natijalari va Maslahatlar:
            </h3>
            <div className="markdown-content">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
