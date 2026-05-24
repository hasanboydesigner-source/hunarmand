import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'uz', label: "O'zbek", short: 'UZ', flag: 'https://flagcdn.com/w40/uz.png' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: 'https://flagcdn.com/w40/ru.png' },
  { code: 'en', label: 'English', short: 'EN', flag: 'https://flagcdn.com/w40/gb.png' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="lang-switcher-wrap" style={{ flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 50 }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            border: '1px solid var(--border)', 
            borderRadius: '20px', 
            padding: '0 12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '6px', 
            fontSize: '14px', 
            fontWeight: '600', 
            background: 'var(--bg-secondary)', 
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <Globe size={18} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
          <span>{currentLang.short}</span>
        </button>

        {isOpen && (
          <div 
            style={{ 
              boxSizing: 'border-box',
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              width: '160px',
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              outline: 'none',
              animation: 'dropdownFadeIn 0.2s ease-out forwards'
            }}
          >
            {languages.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    color: isSelected ? 'var(--brand-500)' : 'var(--text-primary)',
                    fontWeight: isSelected ? '600' : '500',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={lang.flag} alt={lang.code} style={{ width: '22px', height: '16px', borderRadius: '3px', objectFit: 'cover', boxShadow: '0 0 3px rgba(0,0,0,0.1)' }} />
                    <span style={{ paddingTop: '2px' }}>{lang.label}</span>
                  </div>
                  {isSelected && <Check size={18} style={{ color: 'var(--brand-500)', marginLeft: '8px' }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .lang-switcher-wrap {
          width: 88px;
          height: 40px;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 768px) {
          .lang-switcher-wrap {
            width: 84px;
            height: 38px;
          }
          .lang-switcher-wrap button {
            font-size: 14px !important;
            padding: 0 10px !important;
            gap: 5px !important;
          }
        }
        @media (max-width: 480px) {
          .lang-switcher-wrap {
            width: 78px;
            height: 35px;
          }
          .lang-switcher-wrap button {
            font-size: 13px !important;
            padding: 0 8px !important;
            gap: 4px !important;
          }
          .lang-switcher-wrap button svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
