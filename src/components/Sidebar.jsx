import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/study', icon: '📚', label: 'Học từ vựng' },
  { to: '/grammar', icon: '📘', label: 'Ngữ pháp' },
  { to: '/grammar-practice', icon: '✍️', label: 'Luyện tập ngữ pháp' },
  { to: '/review', icon: '🔁', label: 'Ôn tập' },
  { to: '/daily-sentence', icon: '💬', label: 'Câu giao tiếp' },
  { to: '/listening', icon: '🎧', label: 'Luyện nghe' },
  { to: '/quiz', icon: '🎯', label: 'Quiz' },
  { to: '/bookmarks', icon: '⭐', label: 'Đã đánh dấu' },
  { to: '/stats', icon: '📊', label: 'Thống kê' },
];

export default function Sidebar() {
  const { getReviewCount, theme, toggleTheme, getLevel, xp } = useApp();
  const dueCount = getReviewCount();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">🇬🇧</div>
          <span className="sidebar-logo-text">WordFlow</span>
        </NavLink>

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
        </div>
      </aside>

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
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
