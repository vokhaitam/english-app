import React, { useState, useEffect } from 'react';

export default function InstallButton({ variant = 'desktop' }) {
  const [deferred, setDeferred] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const android = /Android/.test(navigator.userAgent);
    const standalone =
      window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsIOS(ios);
    setIsAndroid(android);
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
    // Mở modal hướng dẫn cho cả iPhone, Android và desktop
    setShowModal(true);

    // Nếu Android/Desktop có beforeinstallprompt → vẫn thử gọi
    if (!isIOS && deferred) {
      try {
        deferred.prompt();
        const { outcome } = await deferred.userChoice;
        if (outcome === 'accepted') {
          setShowModal(false);
        }
        setDeferred(null);
      } catch (err) {
        // ignore
      }
    }
  };

  // Trả về nút cài nếu có event Chrome/Android, iOS, hoặc Android thuần
  if (!deferred && !isIOS && !isAndroid) return null;

  return (
    <>
      <button
        type="button"
        className={className}
        style={
          variant === 'desktop'
            ? {
                background: 'var(--gradient-hero)',
                color: '#fff',
                fontWeight: 700,
              }
            : undefined
        }
        onClick={handleClick}
      >
        <span>📲</span>
        <span>
          {isIOS ? 'Thêm vào iPhone' : isAndroid ? 'Cài app Android' : 'Cài app WordFlow'}
        </span>
      </button>

      {showModal && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

/* ─────────────────── Install Guide Modal ─────────────────── */

function InstallGuideModal({ isIOS, isAndroid, onClose }) {
  const [step, setStep] = useState(0);

  const stepsIOS = [
    {
      icon: '1️⃣',
      title: 'Mở bằng Safari',
      desc: 'Đảm bảo bạn đang dùng trình duyệt Safari (không phải Chrome hay Facebook).',
      visual: <PhoneFrame safari />,
    },
    {
      icon: '2️⃣',
      title: 'Bấm nút Chia sẻ',
      desc: 'Bấm vào biểu tượng Chia sẻ ⬆️ ở thanh dưới cùng của Safari.',
      visual: (
        <PhoneFrame>
          <div className="install-mock-bar" />
          <div className="install-mock-content" />
          <div className="install-mock-toolbar">
            <div className="install-mock-tab" />
            <div className="install-mock-tab" />
            <div className="install-mock-tab install-mock-tab-active">
              <span style={{ fontSize: '1.4rem' }}>⬆️</span>
            </div>
            <div className="install-mock-tab" />
            <div className="install-mock-tab" />
          </div>
          <div className="install-mock-arrow">⬆️</div>
        </PhoneFrame>
      ),
    },
    {
      icon: '3️⃣',
      title: 'Chọn "Thêm vào MH chính"',
      desc: 'Kéo xuống và tìm biểu tượng ➕ "Thêm vào Màn hình chính".',
      visual: (
        <PhoneFrame>
          <div className="install-mock-share-sheet">
            <div className="install-mock-share-row">
              <div className="install-mock-share-icon">➕</div>
              <span>Thêm vào MH chính</span>
            </div>
            <div className="install-mock-share-row">
              <div className="install-mock-share-icon">🔖</div>
              <span>Đánh dấu</span>
            </div>
            <div className="install-mock-share-row">
              <div className="install-mock-share-icon">📋</div>
              <span>Sao chép</span>
            </div>
          </div>
        </PhoneFrame>
      ),
    },
    {
      icon: '4️⃣',
      title: 'Bấm "Thêm" → Xong!',
      desc: 'WordFlow sẽ xuất hiện trên màn hình chính như app thật 🎉',
      visual: (
        <PhoneFrame>
          <div className="install-mock-home">
            <div className="install-mock-wallpaper" />
            <div className="install-mock-app-icon install-mock-app-icon-pulse">
              <span style={{ fontSize: '1.4rem' }}>W</span>
            </div>
            <div style={{ fontSize: '0.7rem', marginTop: '4px', textAlign: 'center' }}>
              WordFlow
            </div>
          </div>
        </PhoneFrame>
      ),
    },
  ];

  const stepsAndroid = [
    {
      icon: '1️⃣',
      title: 'Mở bằng Chrome',
      desc: 'Dùng trình duyệt Chrome để có trải nghiệm tốt nhất.',
      visual: <PhoneFrame chrome />,
    },
    {
      icon: '2️⃣',
      title: 'Bấm nút Cài app',
      desc: 'Sau khi bấm 📲, một popup "Cài ứng dụng" sẽ hiện ra. Bấm Cài đặt.',
      visual: (
        <PhoneFrame>
          <div className="install-mock-content" />
          <div className="install-mock-chrome-prompt">
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cài ứng dụng?</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, margin: '4px 0' }}>
              WordFlow sẽ được cài vào thiết bị
            </div>
            <div className="install-mock-chrome-btns">
              <button className="install-mock-btn-cancel">Hủy</button>
              <button className="install-mock-btn-install">Cài đặt</button>
            </div>
          </div>
        </PhoneFrame>
      ),
    },
    {
      icon: '3️⃣',
      title: 'Đợi cài xong',
      desc: 'Quá trình cài chỉ mất 2-3 giây.',
      visual: (
        <PhoneFrame>
          <div className="install-mock-content" />
          <div className="install-mock-chrome-prompt">
            <div className="install-mock-spinner" />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>
              Đang cài đặt...
            </div>
          </div>
        </PhoneFrame>
      ),
    },
    {
      icon: '4️⃣',
      title: 'Mở app WordFlow!',
      desc: 'Tìm icon WordFlow trong menu ứng dụng 🎉',
      visual: (
        <PhoneFrame>
          <div className="install-mock-home">
            <div className="install-mock-wallpaper" />
            <div className="install-mock-app-icon install-mock-app-icon-pulse">
              <span style={{ fontSize: '1.4rem' }}>W</span>
            </div>
            <div style={{ fontSize: '0.7rem', marginTop: '4px', textAlign: 'center' }}>
              WordFlow
            </div>
          </div>
        </PhoneFrame>
      ),
    },
  ];

  const steps = isIOS ? stepsIOS : stepsAndroid;
  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="install-modal-overlay fade-in" onClick={onClose}>
      <div
        className="install-modal card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="install-modal-header">
          <div>
            <div className="install-modal-eyebrow">
              {isIOS ? '🍎 Hướng dẫn cho iPhone' : '🤖 Hướng dẫn cho Android'}
            </div>
            <h2 className="install-modal-title">Cài WordFlow lên {isIOS ? 'iPhone' : 'điện thoại'}</h2>
            <p className="install-modal-subtitle">
              Trải nghiệm như app thật — nhanh, mượt, không cần mạng.
            </p>
          </div>
          <button className="install-modal-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Progress dots */}
        <div className="install-modal-dots">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`install-modal-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
              aria-label={`Bước ${i + 1}`}
            />
          ))}
        </div>

        {/* Visual + Content */}
        <div className="install-modal-body">
          <div className="install-modal-visual">{currentStep.visual}</div>
          <div className="install-modal-text">
            <div className="install-modal-step">
              <span className="install-modal-step-icon">{currentStep.icon}</span>
              <span className="install-modal-step-num">Bước {step + 1}/{steps.length}</span>
            </div>
            <h3 className="install-modal-step-title">{currentStep.title}</h3>
            <p className="install-modal-step-desc">{currentStep.desc}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="install-modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
          >
            {step === 0 ? 'Đóng' : '← Quay lại'}
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={onClose}>
              Đã hiểu 🎉
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Tiếp theo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Phone Frame (visual mockup) ─────────────────── */

function PhoneFrame({ children, safari, chrome }) {
  return (
    <div className="phone-frame">
      <div className="phone-frame-notch" />
      <div className="phone-frame-screen">
        {children || (
          <>
            {safari && (
              <div className="phone-frame-urlbar">
                <span>🔒</span>
                <span>english-app.onrender.com</span>
              </div>
            )}
            {chrome && (
              <div className="phone-frame-urlbar">
                <span>🔒</span>
                <span>english-app.onrender.com</span>
              </div>
            )}
            <div className="install-mock-content" />
            <div className="install-mock-gradient" />
          </>
        )}
      </div>
    </div>
  );
}
