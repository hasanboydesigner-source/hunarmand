import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('tour-v2-done');
    if (!done) {
      const t = setTimeout(() => setRun(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const steps = [
    {
      target: '#search-btn',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>📸 Rasm orqali qidirish!</h3>
          <p style={{ margin: 0, fontSize: 13.5, color: '#555', lineHeight: 1.6 }}>
            Kerakli mahsulotni topish uchun faqat matn yozmang — telefon kamerangiz yoki galereyadan
            <b> rasm yuklang</b>. AI rasm orqali eng o'xshash hunarmand buyumlarini topib beradi!
          </p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#tour-chatbot-btn',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>🤖 AI Maslahatchi</h3>
          <p style={{ margin: 0, fontSize: 13.5, color: '#555', lineHeight: 1.6 }}>
            Qanday sovg'a tanlashni bilmayapsizmi? Bizning AI yordamchimizdan so'rang!
            U sizga narx, material va hunarmand bo'yicha <b>bepul tavsiyalar</b> beradi — kun-u tun ishlaydi!
          </p>
        </div>
      ),
      placement: 'top-end',
    },
  ];

  const handleCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem('tour-v2-done', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      disableOverlayClose={true}
      spotlightClicks={true}
      callback={handleCallback}
      locale={{
        back: 'Orqaga',
        close: 'Yopish',
        last: "Boshlash! 🚀",
        next: 'Keyingi →',
        skip: "O'tkazib yuborish",
      }}
      styles={{
        options: {
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0,0,0,0.6)',
          primaryColor: '#c97a22',
          textColor: '#222',
          zIndex: 10000,
          width: 310,
        },
        tooltip: {
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          padding: '20px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#c97a22',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 13,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#888',
          fontSize: 13,
        },
        buttonSkip: {
          color: '#aaa',
          fontSize: 12,
        },
        spotlight: {
          borderRadius: 12,
        },
      }}
    />
  );
}
