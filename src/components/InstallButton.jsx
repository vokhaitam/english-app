import React, { useState, useEffect } from 'react';

export default function InstallButton({ variant = 'desktop' }) {
  const [deferred, setDeferred] = useState(null);

  useEffect(() => {
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

  if (!deferred) return null;

  const className = variant === 'mobile' ? 'mobile-install' : 'theme-toggle';

  return (
    <button
      type="button"
      className={className}
      style={variant === 'desktop' ? { background: 'var(--gradient-hero)', color: '#fff', fontWeight: 700 } : undefined}
      onClick={async () => {
        deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
    >
      <span>💾</span>
      <span>Cài app WordFlow</span>
    </button>
  );
}