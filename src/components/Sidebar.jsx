import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import InstallButton from './InstallButton';

// japaneseOnly: mục chỉ có ý nghĩa với gói Nhật.
const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard', short: 'Trang chủ' },
  { to: '/roadmap', icon: '🗺️', label: 'Lộ trình', short: 'Lộ trình' },
  { to: '/study', icon: '📚', label: 'Học từ vựng', short: 'Từ vựng' },
  { to: '/quiz', icon: '🎯', label: 'Quiz', short: 'Quiz' },
  { to: '/kana', icon: '🔤', label: 'Bảng kana', short: 'Kana', japaneseOnly: true },
  { to: '/grammar', icon: '📘', label: 'Ngữ pháp', short: 'Ngữ pháp' },
  { to: '/games', icon: '🎮', label: 'Game', short: 'Game' },
  { to: '/my-decks', icon: '🗂️', label: 'Bộ từ của tôi', short: 'Bộ từ' },
  { to: '/grammar-practice', icon: '✍️', label: 'Luyện tập ngữ pháp', short: 'Luyện tập' },
  { to: '/review', icon: '🔁', label: 'Ôn tập', short: 'Ôn tập' },
  { to: '/listening', icon: '🎧', label: 'Luyện nghe', short: 'Luyện nghe' },
  { to: '/stats', icon: '📊', label: 'Thống kê', short: 'Thống kê' },
];

export default function Sidebar() {
  const { getReviewCount, theme, toggleTheme, getLevel, xp } = useApp();
  const { lang, languages, selectLanguage, pack } = useLanguage();
  const dueCount = getReviewCount();
  const visibleNavItems = navItems.filter(i => !i.japaneseOnly || lang === 'ja');
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === '1');

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const mobileItems = visibleNavItems.slice(0, 5);

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="mobile-top-bar">
        <NavLink to="/" className="mobile-logo">
          <span className="mobile-logo-flag">{pack.flag}</span>
          <span className="mobile-logo-name">WordFlow</span>
        </NavLink>

        <div
          className="lang-switch mobile-lang-switch"
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
              <span className="lang-switch-name">{l.name}</span>
            </button>
          ))}
        </div>

        <button
          className="mobile-theme-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Chuyển chế độ tối' : 'Chuyển chế độ sáng'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
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
          {visibleNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.to === '/review' && dueCount > 0 && (
                <span className="nav-badge">{dueCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card sidebar-level-card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>🏅</div>
            <div style={{ flex: 1, minWidth: 0 }} className="sidebar-level-info">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Cấp {getLevel()} <span style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.75rem' }}>· {xp} XP</span>
              </div>
              <div className="progress-bar-container" style={{ height: '4px', marginTop: '5px' }}>
                <div className="progress-bar-fill" style={{ width: `${xp % 100}%` }} />
              </div>
            </div>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} title="Đổi sáng / tối">
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="theme-toggle-label">{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
          </button>
          <InstallButton />
          <button
            type="button"
            className="sidebar-collapse"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            <span>{collapsed ? '»' : '«'}</span>
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
      </aside>

      <InstallButton variant="mobile" />

      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {mobileItems.map(item => (
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
