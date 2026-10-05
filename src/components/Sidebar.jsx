import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import InstallButton from './InstallButton';

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard', short: 'Trang chủ' },
  { to: '/study', icon: '📚', label: 'Học từ vựng', short: 'Từ vựng' },
  { to: '/grammar', icon: '📘', label: 'Ngữ pháp', short: 'Ngữ pháp' },
  { to: '/grammar-practice', icon: '✍️', label: 'Luyện tập ngữ pháp', short: 'Luyện tập' },
  { to: '/review', icon: '🔁', label: 'Ôn tập', short: 'Ôn tập' },
  { to: '/daily-sentence', icon: '💬', label: 'Câu giao tiếp', short: 'Câu mẫu' },
  { to: '/listening', icon: '🎧', label: 'Luyện nghe', short: 'Luyện nghe' },
  { to: '/quiz', icon: '🎯', label: 'Quiz', short: 'Quiz' },
  { to: '/word-rain', icon: '⌨️', label: 'Mưa từ vựng', short: 'Mưa từ' },
  { to: '/typing-practice', icon: '✍️', label: 'Luyện ghi từ', short: 'Ghi từ' },
  { to: '/bookmarks', icon: '⭐', label: 'Đã đánh dấu', short: 'Yêu thích' },
  { to: '/stats', icon: '📊', label: 'Thống kê', short: 'Thống kê' },
];

export default function Sidebar() {
  const { getReviewCount, theme, toggleTheme, getLevel, xp } = useApp();
  const { lang, languages, selectLanguage, pack } = useLanguage();
  const dueCount = getReviewCount();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">{pack.flag}</div>
          <span className="sidebar-logo-text">WordFlow</span>
        </NavLink>

        <div
          className="lang-switch"
          role="group"
          aria-label="Chọn ngôn ngữ học"
          style={{ '--lang-count': languages.length }}
        >
          <span
            className="lang-switch-thumb"
            style={{ transform: `translateX(${Math.max(0, languages.findIndex(l => l.id === lang)) * 100}%)` }}
            aria-hidden="true"
          />
          {languages.map(l => (
            <button
              key={l.id}
              type="button"
              className={`lang-switch-btn ${l.id === lang ? 'active' : ''}`}
              onClick={() => selectLanguage(l.id)}
              aria-pressed={l.id === lang}
              title={`Học ${l.name}`}
            >
              <span className="lang-switch-flag" aria-hidden="true">{l.flag}</span>
              <span className="lang-switch-name">{l.nativeName}</span>
            </button>
          ))}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.to === '/review' && dueCount > 0 && (
                <span className="nav-badge">{dueCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.4rem' }}>🏅</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem' }}>
                Cấp {getLevel()}
              </div>
              <div className="progress-bar-container" style={{ height: '5px', marginTop: '6px' }}>
                <div className="progress-bar-fill" style={{ width: `${xp % 100}%` }} />
              </div>
            </div>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} title="Đổi sáng / tối">
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
          </button>
          <InstallButton />
        </div>
      </aside>

      <InstallButton variant="mobile" />

      {/* Mobile floating theme toggle */}
      <button
        className="mobile-theme-toggle"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Chuyển chế độ tối' : 'Chuyển chế độ sáng'}
        aria-label="Đổi sáng/tối"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {navItems.slice(0, 5).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `mobile-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.short}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
