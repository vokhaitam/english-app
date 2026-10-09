import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import TopicSelector from '../components/TopicSelector';
import { shuffle, pickRandom } from '../lib/gameUtils';
import { speak } from '../lib/speech';

const PAIR_OPTIONS = [6, 8, 12];
const FLIP_DELAY = 700;

function buildCards(words) {
  const cards = [];
  for (const w of words) {
    cards.push({ uid: `${w.id}-w`, wordId: w.id, topicId: w.topicId, text: w.word, side: 'word', word: w });
    cards.push({ uid: `${w.id}-m`, wordId: w.id, topicId: w.topicId, text: w.meaning, side: 'meaning', word: w });
  }
  return shuffle(cards);
}

export default function MemoryMatchPage() {
  const { vocabulary, topics } = useLanguage();
  const { markKnown, addQuizScore } = useApp();
  const [phase, setPhase] = useState('select'); // 'select' | 'play' | 'done'
  const [topicId, setTopicId] = useState(null);
  const [pairCount, setPairCount] = useState(8);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(null);

  const pairs = pairCount;

  useEffect(() => {
    if (phase !== 'play') return undefined;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const finish = (movesUsed) => {
    const penalty = Math.max(0, movesUsed - pairs);
    const score = Math.max(1, pairs * 2 - penalty);
    const total = pairs * 2;
    addQuizScore(score, total, 'game:memory-match');
    setResult({ score, total, moves: movesUsed, seconds });
    setPhase('done');
  };

  const start = (id) => {
    const words = pickRandom(vocabulary[id] || [], pairs).map(w => ({ ...w, topicId: id }));
    if (words.length < pairs) return;
    setTopicId(id);
    setCards(buildCards(words));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setLocked(false);
    setResult(null);
    setPhase('play');
  };

  const handleFlip = (card) => {
    if (locked || flipped.includes(card.uid) || matched.includes(card.uid)) return;
    const next = [...flipped, card.uid];
    setFlipped(next);
    if (card.side === 'word') speak(card.text, 0.85);

    if (next.length < 2) return;

    const [a, b] = next.map(uid => cards.find(c => c.uid === uid));
    const movesUsed = moves + 1;
    setMoves(movesUsed);
    setLocked(true);

    if (a.wordId === b.wordId && a.side !== b.side) {
      setTimeout(() => {
        const nextMatched = [...matched, a.uid, b.uid];
        setMatched(nextMatched);
        setFlipped([]);
        setLocked(false);
        markKnown(a.topicId, a.wordId, { silent: true });
        if (nextMatched.length === cards.length) finish(movesUsed);
      }, 380);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, FLIP_DELAY);
    }
  };

  const topicData = topics.find(t => t.id === topicId);

  // ---- CHỌN CHỦ ĐỀ ----
  if (phase === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <Link to="/games" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }}>← Game khác</Link>
          <h1 className="page-title">🃏 Ghép thẻ</h1>
          <p className="page-subtitle">Lật hai thẻ — ghép từ với đúng nghĩa của nó</p>
        </div>

        <div className="card" style={{ marginBottom: '20px', maxWidth: '520px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Số cặp mỗi ván</h2>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {PAIR_OPTIONS.map(n => (
              <button
                key={n}
                className={`btn ${pairCount === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPairCount(n)}
              >
                {n} cặp
              </button>
            ))}
          </div>
        </div>

        <TopicSelector onSelect={start} />
      </div>
    );
  }

  // ---- KẾT QUẢ ----
  if (phase === 'done' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{pct >= 85 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">{pct >= 85 ? 'Trí nhớ tuyệt vời!' : pct >= 60 ? 'Khá lắm!' : 'Thử lại nhé!'}</h2>
        <p className="text-secondary">
          Chủ đề: <strong style={{ color: 'var(--text-primary)' }}>{topicData?.name}</strong>
        </p>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{pairs}/{pairs}</div>
            <div className="completion-stat-label">Cặp đã ghép</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{result.moves}</div>
            <div className="completion-stat-label">Số lượt lật</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>{pct}%</div>
            <div className="completion-stat-label">Điểm</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{result.seconds}s</div>
            <div className="completion-stat-label">Thời gian</div>
          </div>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={() => start(topicId)}>🔄 Chơi lại</button>
          <button className="btn btn-primary" onClick={() => setPhase('select')}>🃏 Chủ đề khác</button>
        </div>
      </div>
    );
  }

  // ---- TRÒ CHƠI ----
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPhase('select')}>← Thoát</button>
        <div className="badge badge-purple">{topicData?.icon} {topicData?.name}</div>
        <div className="badge badge-yellow">⏱ {seconds}s</div>
        <div className="badge badge-purple">🔁 {moves} lượt</div>
        <div style={{ marginLeft: 'auto' }} className="badge badge-green">
          {matched.length / 2}/{pairs} cặp
        </div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${cards.length ? (matched.length / cards.length) * 100 : 0}%` }} />
      </div>

      <div className="mm-grid" style={{ '--mm-cols': pairCount >= 12 ? 4 : 3 }}>
        {cards.map(card => {
          const isOpen = flipped.includes(card.uid) || matched.includes(card.uid);
          const isMatched = matched.includes(card.uid);
          return (
            <button
              key={card.uid}
              className={`mm-card ${isOpen ? 'open' : ''} ${isMatched ? 'matched' : ''} ${card.side === 'meaning' ? 'meaning' : 'word'}`}
              onClick={() => handleFlip(card)}
              disabled={isMatched}
            >
              <span className="mm-inner">
                {isOpen ? card.text : '🌸'}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-muted text-center" style={{ fontSize: '0.8rem', marginTop: '16px' }}>
        Ghép từ (trái) với nghĩa (phải) — ghép đúng thì hai thẻ biến mất
      </p>
    </div>
  );
}
