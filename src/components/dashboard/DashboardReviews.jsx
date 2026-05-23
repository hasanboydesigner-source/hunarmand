import { Star, ThumbsUp, MessageSquare, CheckCircle2 } from 'lucide-react';

const MOCK_REVIEWS = [];

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} fill={i <= rating ? '#f59e0b' : 'transparent'} color={i <= rating ? '#f59e0b' : '#d1d5db'}/>
      ))}
    </div>
  );
}

export default function DashboardReviews({ reviews = [] }) {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Sharhlar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
          <Star size={15} fill="#f59e0b" color="#f59e0b"/>
          <strong style={{ color: '#111' }}>{avg}</strong>
          <span>o'rtacha reyting · {reviews.length} ta sharh</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.length > 0 ? (
          reviews.map(r => (
            <div key={r._id || r.id || Math.random()} style={{
              background: '#fff', border: '1px solid #ebebeb',
              borderRadius: 14, padding: '18px 20px',
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#f0f0f0', color: '#333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>
                    {r.author ? r.author[0].toUpperCase() : 'M'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{r.author || 'Mijoz'} ({r.productName})</span>
                      {r.verified && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          background: '#dcfce7', color: '#15803d',
                          fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 99
                        }}>
                          <CheckCircle2 size={10}/> Tasdiqlangan
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: 3 }}>
                      <Stars rating={r.rating}/>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: '#aaa' }}>{new Date(r.createdAt || Date.now()).toLocaleDateString('uz-UZ')}</span>
              </div>

              {/* Review text */}
              <p style={{ fontSize: 13.5, color: '#444', lineHeight: 1.65, margin: 0 }}>{r.text}</p>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0f0f0'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
                  <ThumbsUp size={13} color="#c97a22"/> {r.helpful || 0} ta foydali
                </span>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 8,
                  border: '1.5px solid #ebebeb', background: '#fff',
                  fontSize: 12.5, fontWeight: 500, color: '#555',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  <MessageSquare size={13}/> Javob berish
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
            Hozircha sharhlar yo'q
          </div>
        )}
      </div>
    </div>
  );
}
