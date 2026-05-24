import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Kritik xatolik ushlandi (ErrorBoundary):", error, errorInfo);
    
    // Agar dastur ishdan chiqsa (masalan localStorage dagi eski data tufayli),
    // avtomatik ravishda xotirani tozalab, sahifani yangilaymiz.
    // Cheksiz reload tsikliga tushib qolmaslik uchun sessionStorage dan foydalanamiz.
    if (!sessionStorage.getItem('reloaded_from_error')) {
      console.log("Xotira tozalanmoqda va sahifa qayta yuklanmoqda...");
      localStorage.removeItem('hunarmand-auth');
      localStorage.removeItem('hunarmand-cart');
      localStorage.removeItem('hunarmand-wishlist');
      sessionStorage.setItem('reloaded_from_error', 'true');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '20px',
          background: '#f9fafb'
        }}>
          <div style={{ 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '15px' }}>Saytda xatolik yuz berdi</h2>
            <p style={{ color: '#6b7280', marginBottom: '25px', lineHeight: '1.6' }}>
              Keçirasiz, brauzer xotirasidagi eski ma'lumotlar tufayli nosozlik kelib chiqdi. 
              Saytni qayta ishga tushirish uchun quyidagi tugmani bosing.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace('/');
              }}
              style={{ 
                background: '#c97a22', 
                color: '#fff', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                fontSize: '15px', 
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#b46d1e'}
              onMouseOut={(e) => e.target.style.background = '#c97a22'}
            >
              Sahifani yangilash va tozalash
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
