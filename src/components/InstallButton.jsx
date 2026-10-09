import React, { useState, useEffect } from 'react';

export default function InstallButton({ variant = 'desktop' }) {
  const [deferred, setDeferred] = useState(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsIOS(ios);
    setIsStandalone(standalone);

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (isStandalone) return null;

  const className = variant === 'mobile' ? 'mobile-install' : 'theme-toggle';

  const handleClick = async () => {
    if (isIOS) {
      setShowIosModal(true);
      return;
    }
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    }
  };

  // Trả về nút cài nếu có event Chrome/Android hoặc là thiết bị iOS chưa cài
  if (!deferred && !isIOS) return null;

  return (
    <>
      <button
        type="button"
        className={className}
        style={variant === 'desktop' ? { background: 'var(--gradient-hero)', color: '#fff', fontWeight: 700 } : undefined}
        onClick={handleClick}
      >
        <span>📲</span>
        <span>{isIOS ? 'Thêm vào iPhone' : 'Cài app WordFlow'}</span>
      </button>

      {showIosModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowIosModal(false)}
        >
          <div
            className="card fade-in"
            style={{ maxWidth: '420px', width: '100%', padding: '24px', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📲</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
              Cài app WordFlow trên iPhone
            </h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Để trải nghiệm ứng dụng mượt mà như app tải từ App Store:
            </p>

            <div style={{ textAlign: 'left', background: 'var(--bg-card-subtle, rgba(255,255,255,0.05))', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>1️⃣</span>
                <span>Mở link web bằng trình duyệt <strong>Safari</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>2️⃣</span>
                <span>Bấm vào nút <strong>Chia sẻ (Share) ⬆️</strong> ở dưới màn hình</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>3️⃣</span>
                <span>Chọn <strong>"Thêm vào MH chính"</strong> ➔ Bấm <strong>Thêm</strong></span>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={() => setShowIosModal(false)}>
              Đã hiểu 👌
            </button>
          </div>
        </div>
      )}
    </>
  );
}