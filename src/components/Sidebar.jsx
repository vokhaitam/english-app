import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import InstallButton from './InstallButton';

// Sidebar gọn — tất cả trong 1 menu
const navItems = [
  { to: '/', icon: '🏠', label: 'Trang chủ' },
  { to: '/study', icon: '📚', label: 'Học từ vựng' },
  { to: '/roadmap', icon: '🗺️', label: 'Lộ trình' },
  { to: '/quiz', icon: '🎯', label: 'Quiz nhanh' },
  { to: '/review', icon: '🔁', label: 'Ôn tập' },
  { to: '/grammar', icon: '📘', label: 'Ngữ pháp' },
  { to: '/games', icon: '🎮', label: 'Game' },
  { to: '/my-decks', icon: '🗂️', label: 'Bộ từ của tôi' },
  { to: '/listening', icon: '🎧', label: 'Luyện nghe' },
  { to: '/kana', icon: '🔤', label: 'Bảng kana', japaneseOnly: true },
  { to: '/grammar-practice', icon: '✍️', label: 'Luyện tập' },
  { to: '/stats', icon: '📊', label: 'Thống kê' },
];

export default function Sidebar() {
  const { getReviewCount, theme, toggleTheme, getLevel, xp, setSeasonPref, currentSeason } = useApp();
  const { lang, languages, selectLanguage, pack } = useLanguage();
  const dueCount = getReviewCount();
  const visibleNavItems = navItems.filter(i => !i.japaneseOnly || lang === 'ja');
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === '1');
  const seasons = [
    { id: 'spring', label: 'Xuân', icon: '🌸' },
    { id: 'summer', label: 'Hạ', icon: '☀️' },
    { id: 'autumn', label: 'Thu', icon: '🍂' },
    { id: 'winter', label: 'Đông', icon: '❄️' },
  ];

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const mobileItems = visibleNavItems.slice(0, 6);

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
              <span className="lang-switch-name">{l.nativeName}</span>
            </button>
          ))}
        </div>

        <label className="mobile-season-control" title="Đổi hiệu ứng theo mùa">
          <span aria-hidden="true">
            {seasons.find(season => season.id === currentSeason)?.icon || '🌸'}
          </span>
          <select
            className="mobile-season-select"
            value={currentSeason}
            onChange={event => setSeasonPref(event.target.value)}
            aria-label="Đổi hiệu ứng theo mùa"
          >
            {seasons.map(season => (
              <option key={season.id} value={season.id}>
                {season.icon} {season.label}
              </option>
            ))}
          </select>
        </label>

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

          <div className="season-picker">
            <span className="season-picker-label">Mùa</span>
            <div className="season-options">
              {seasons.map(opt => (
                <button
                  key={opt.id}
                  className={`season-option ${currentSeason === opt.id ? 'active' : ''}`}
                  onClick={() => setSeasonPref(opt.id)}
                  title={opt.label}
                >
                  <span>{opt.icon}</span>
                </button>
              ))}
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
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
