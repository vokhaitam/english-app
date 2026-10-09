import React from 'react';
import { Link } from 'react-router-dom';

const GAMES = [
  {
    to: '/word-rain',
    icon: '⌨️',
    name: 'Mưa từ vựng',
    desc: 'Gõ chính xác từ đang rơi trước khi chúng chạm đáy',
    tag: 'Nhập nhanh',
    gradient: 'linear-gradient(135deg, #e8326f, #ff7ea6)',
  },
  {
    to: '/typing-practice',
    icon: '✍️',
    name: 'Luyện ghi từ',
    desc: 'Gõ lại từ hoặc câu theo nghĩa, có kiểm tra dấu tiếng Việt',
    tag: 'Chính tả',
    gradient: 'linear-gradient(135deg, #0e94b5, #4ecdc4)',
  },
  {
    to: '/games/memory-match',
    icon: '🃏',
    name: 'Ghép thẻ',
    desc: 'Lật thẻ và ghép từ với nghĩa đúng trước khi hết lượt',
    tag: 'Trí nhớ',
    gradient: 'linear-gradient(135deg, #7e57c2, #b388ff)',
  },
  {
    to: '/games/word-scramble',
    icon: '🔤',
    name: 'Xếp chữ',
    desc: 'Xếp lại các chữ cái bị xáo trộn thành từ có nghĩa',
    tag: 'Đố vui',
    gradient: 'linear-gradient(135deg, #c46a0e, #ffb74d)',
  },
  {
    to: '/games/listening-challenge',
    icon: '🎧',
    name: 'Thử thách nghe',
    desc: 'Nghe phát âm rồi chọn đúng nghĩa — có 3 mạng mỗi ván',
    tag: 'Nghe',
    gradient: 'linear-gradient(135deg, #1f9d61, #66bb6a)',
  },
  {
    to: '/games/sentence-builder',
    icon: '🧩',
    name: 'Xếp câu',
    desc: 'Xếp các từ bị xáo trộn thành câu hoàn chỉnh theo nghĩa',
    tag: 'Câu',
    gradient: 'linear-gradient(135deg, #df3b4f, #ff8a80)',
  },
];

export default function GamesPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🎮 Game luyện từ vựng</h1>
        <p className="page-subtitle">
          6 game tương tác — chơi mà học, mỗi ván đều cộng XP và streak
        </p>
      </div>

      <div className="games-grid">
        {GAMES.map(g => (
          <Link key={g.to} to={g.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="game-card">
              <div className="game-card-top" style={{ background: g.gradient }}>
                <span className="game-card-icon">{g.icon}</span>
                <span className="game-card-tag">{g.tag}</span>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.05rem', marginBottom: '6px' }}>
                  {g.name}
                </div>
                <p className="text-secondary" style={{ fontSize: '0.83rem', lineHeight: 1.5 }}>
                  {g.desc}
                </p>
                <div className="roadmap-cta">Chơi ngay →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
