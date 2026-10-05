import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { speak } from '../lib/speech';

const normalize = (s) => s.trim().toLowerCase().replace(/[^a-z\s]/gi, '').replace(/\s+/g, ' ');

// Tiếng Nhật gõ bằng romaji, tiếng Anh gõ bằng chính từ.
const answerFor = (w) => (w.romaji || w.word);

export default function ListeningPage() {
  const { vocabulary, topics } = useLanguage();
  const { addQuizScore } = useApp();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('select');
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState('');
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [slow, setSlow] = useState(false);

  const start = (topicId) => {
    const words = topicId === 'all'
      ? Object.entries(vocabulary).flatMap(([tid, ws]) => ws.map(w => ({ ...w, topicId: tid })))
      : (vocabulary[topicId] || []).map(w => ({ ...w, topicId }));
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    setSelectedTopic(topicId);
    setQueue(shuffled);
    setCurrent(0);
    setTyped('');
    setAnswered(false);
    setScore(0);
    setWrong([]);
    setMode('quiz');
    const first = shuffled[0];
    if (first) speak(first.word);
  };

  if (mode === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🎧 Luyện nghe</h1>
          <p className="page-subtitle">Nghe phát âm và gõ chính tả từ tiếng Anh</p>
        </div>
        <div className="topic-grid">
          <div key="all" className="topic-card" style={{ '--topic-gradient': 'var(--gradient-hero)' }} onClick={() => start('all')}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-hero)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            <div className="topic-icon">🎲</div>
            <div className="topic-name">Trộn tất cả</div>
            <div className="topic-count">Hỗn hợp các chủ đề</div>
          </div>
          {topics.map(topic => (
            <div key={topic.id} className="topic-card" style={{ '--topic-gradient': topic.gradient }} onClick={() => start(topic.id)}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: topic.gradient, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
              <div className="topic-icon">{topic.icon}</div>
              <div className="topic-name">{topic.name}</div>
              <div className="topic-count">{(vocabulary[topic.id] || []).length} từ • 10 câu</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'done') {
    const pct = Math.round((score / queue.length) * 100);
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">{pct >= 80 ? 'Nghe tốt lắm!' : pct >= 60 ? 'Khá ổn!' : 'Cần luyện thêm!'}</h2>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{score}/{queue.length}</div>
            <div className="completion-stat-label">Đúng</div>
          </div>
        </div>
        {wrong.length > 0 && (
          <div style={{ width: '100%', maxWidth: '420px' }}>
            {wrong.map((w, i) => (
              <div key={i} className="grammar-example" style={{ marginBottom: '8px' }}>
                <span className="grammar-example-arrow">✗</span>
                <span><strong>{w.word}</strong> — {w.meaning}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={() => start(selectedTopic)}>🔄 Làm lại</button>
          <button className="btn btn-primary" onClick={() => setMode('select')}>🎧 Chọn chủ đề khác</button>
        </div>
      </div>
    );
  }

  const q = queue[current];
  const normalized = normalize(typed);
  const isCorrect = answered && normalized === normalize(answerFor(q));

  const check = () => {
    setAnswered(true);
    if (normalized === normalize(answerFor(q))) {
      setScore(s => s + 1);
    } else {
      setWrong(w => [...w, q]);
    }
  };

  const next = () => {
    if (current < queue.length - 1) {
      setCurrent(c => c + 1);
      setTyped('');
      setAnswered(false);
      const nq = queue[current + 1];
      if (nq) speak(nq.word);
    } else {
      addQuizScore(score, queue.length, selectedTopic === 'all' ? 'all' : selectedTopic);
      setMode('done');
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setMode('select')}>← Thoát</button>
        <div className="badge badge-purple">Câu {current + 1}/{queue.length}</div>
        <div style={{ marginLeft: 'auto' }} className="badge badge-yellow">{score} điểm</div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${((current + 1) / queue.length) * 100}%` }} />
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: '24px', padding: '32px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Nhấn 🔊 để nghe lại, rồi gõ từ bạn nghe được
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
          <button className="control-btn speak-btn" style={{ width: 64, height: 64, fontSize: '1.6rem' }} onClick={() => speak(q.word, slow ? 0.55 : 0.85)} title="Nghe">
            🔊
          </button>
          <button className="control-btn" style={{ width: 64, height: 64 }} onClick={() => setSlow(s => !s)} title="Nghe chậm">
            🐢
          </button>
        </div>
        <input
          className="listen-input"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Gõ từ tiếng Anh..."
          onKeyDown={e => { if (e.key === 'Enter' && !answered) check(); }}
          disabled={answered}
          autoFocus
        />
        {answered && (
          <div className="fade-in" style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: '600', color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {isCorrect ? '✅ Chính xác!' : `❌ Đáp án: ${q.word}${q.romaji ? ` (${q.romaji})` : ''} — ${q.meaning}`}
            </p>
          </div>
        )}
      </div>

      {!answered ? (
        <div className="flex" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={check}>Kiểm tra</button>
        </div>
      ) : (
        <div className="flex" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={next}>
            {current < queue.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}