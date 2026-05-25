import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Faqat birinchi marta kirganda ko'rsatish
    const tourCompleted = localStorage.getItem('tour-completed');
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const steps = [
    {
      target: '#search-btn',
      content: (
        <div>
          <h3>Rasm orqali qidirish 📸</h3>
          <p>Endi kerakli mahsulotni topish yanada oson! Bu yerni bosib nafaqat matn, balki <b>rasm orqali ham</b> o'zingizga yoqqan hunarmandchilik buyumini qidirishingiz mumkin.</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#tour-chatbot-btn',
      content: (
        <div>
          <h3>AI Maslahatchi 🤖</h3>
          <p>Qanday sovg'a tanlashni bilmayapsizmi? Bizning aqlli AI yordamchimiz sizga kun-u tun bepul maslahat berishga tayyor!</p>
        </div>
      ),
      placement: 'top-end',
    },
    {
      target: '#mobile-menu-btn',
      content: (
        <div>
          <h3>Qolgan barcha bo'limlar shu yerda! ☰</h3>
          <p>Kategoriyalar, hunarmandlar ro'yxati va sizning profilingiz shu menyu ichida joylashgan. Sayohatni boshlaymizmi?</p>
        </div>
      ),
      placement: 'bottom',
    }
  ].filter(step => {
    // Desktopda mobile-menu-btn yo'q bo'ladi, shuning uchun bu qadamni faqat telefonda ko'rsatamiz
    if (step.target === '#mobile-menu-btn') {
      return window.innerWidth <= 1024;
    }
    return true;
  });

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('tour-completed', 'true');
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
      callback={handleJoyrideCallback}
      locale={{
        back: 'Orqaga',
        close: 'Yopish',
        last: 'Tugatish',
        next: 'Keyingi',
        skip: 'O\'tkazib yuborish'
      }}
      styles={{
        options: {
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.65)',
          primaryColor: '#c97a22',
          textColor: '#333',
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: 'left',
          fontSize: '14px',
          lineHeight: '1.5'
        },
        buttonNext: {
          backgroundColor: '#c97a22',
          borderRadius: '8px'
        },
        buttonBack: {
          color: '#888'
        }
      }}
    />
  );
}
