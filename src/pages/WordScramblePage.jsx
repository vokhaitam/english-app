import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import TopicSelector from '../components/TopicSelector';
import { pickRandom, scrambleWord } from '../lib/gameUtils';
import { latinEqual, romajiEqual } from '../lib/langUtils';
import { speak } from '../lib/speech';

const COUNT_OPTIONS = [5, 10, 15];
const MAX_ATTEMPTS = 3;

function buildRound(vocabulary, topicId, count, isJapanese) {
  const words = pickRandom(vocabulary[topicId] || [], count);
  return words.map(w => {
    const answer = isJapanese ? (w.romaji || w.word) : w.word;
    return { ...w, topicId, answer, scrambled: scrambleWord(answer) };
  });
}

export default function WordScramblePage() {
  const { vocabulary, topics, isJapanese, pack } = useLanguage();
  const { markKnown, addQuizScore } = useApp();
  const [phase, setPhase] = useState('select');
  const [count, setCount] = useState(10);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('typing'); // 'typing' | 'correct' | 'revealed'
  const [hinted, setHinted] = useState(false);
  const [solved, setSolved] = useState(0);

  const current = queue[index] || null;

  const start = (topicId) => {
    const round = buildRound(vocabulary, topicId, count, isJapanese);
    if (round.length === 0) return;
    setQueue(round);
    setIndex(0);
    setInput('');
    setAttempts(0);
    setStatus('typing');
    setHinted(false);
    setSolved(0);
    setPhase('play');
  };

  const check = () => {
    if (!current || status !== 'typing' || !input.trim()) return;
    const equal = isJapanese ? romajiEqual(input, current.answer) : latinEqual(input, current.answer);
    if (equal) {
      setStatus('correct');
      setSolved(s => s + 1);
      markKnown(current.topicId, current.id, { silent: true });
      speak(current.word, 0.85);
    } else if (attempts + 1 >= MAX_ATTEMPTS) {
      setStatus('revealed');
    } else {
      setAttempts(a => a + 1);
    }
  };

  const next = () => {
    if (index < queue.length - 1) {
      setIndex(i => i + 1);
      setInput('');
      setAttempts(0);
      setStatus('typing');
      setHinted(false);
    } else {
      addQuizScore(solved, queue.length, 'game:word-scramble');
      setPhase('done');
    }
  };

  const letters = useMemo(
    () => (current ? [...current.scrambled] : []),
    [current],
  );

  // ---- CHỌN CHỦ ĐỀ ----
  if (phase === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <Link to="/games" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }}>← Game khác</Link>
          <h1 className="page-title">🔤 Xếp chữ</h1>
          <p className="page-subtitle">Xếp lại chữ cái bị xáo trộn thành từ có nghĩa</p>
        </div>

        <div className="card" style={{ marginBottom: '20px', maxWidth: '520px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Số từ mỗi ván</h2>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {COUNT_OPTIONS.map(n => (
              <button
                key={n}
                className={`btn ${count === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCount(n)}
              >
                {n} từ
              </button>
            ))}
          </div>
        </div>

        <TopicSelector onSelect={start} />
      </div>
    );
  }

  // ---- KẾT QUẢ ----
  if (phase === 'done') {
    const pct = Math.round((solved / queue.length) * 100);
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">{pct >= 80 ? 'Xếp chữ siêu phàm!' : pct >= 60 ? 'Khá tốt!' : 'Luyện thêm nhé!'}</h2>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{solved}</div>
            <div className="completion-stat-label">Từ đã xếp ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>{queue.length - solved}</div>
            <div className="completion-stat-label">Chưa được ❌</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>{pct}%</div>
            <div className="completion-stat-label">Điểm</div>
          </div>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={() => start(queue[0].topicId)}>🔄 Làm lại</button>
          <button className="btn btn-primary" onClick={() => setPhase('select')}>🔤 Chủ đề khác</button>
        </div>
      </div>
    );
  }

  // ---- TRÒ CHƠI ----
  if (!current) return null;
  const topicData = topics.find(t => t.id === current.topicId);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPhase('select')}>← Thoát</button>
        <div className="badge badge-purple">{topicData?.icon} {topicData?.name}</div>
        <div style={{ marginLeft: 'auto' }} className="badge badge-yellow">✅ {solved}/{queue.length}</div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>

      <div className="card ws-card">
        <div className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
          Câu {index + 1}/{queue.length} — từ này có nghĩa là:
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 4vw, 1.7rem)',
          fontWeight: '800',
          marginBottom: '18px',
        }}>
          {current.meaning}
        </div>

        <div className="ws-letters">
          {letters.map((ch, i) => (
            <span key={`${ch}-${i}`} className={`ws-letter ${status !== 'typing' ? 'done' : ''}`}>
              {ch === ' ' ? '·' : ch}
            </span>
          ))}
        </div>

        <input
          className="listen-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { if (status === 'typing') check(); else next(); } }}
          placeholder={isJapanese ? 'Gõ romaji của từ...' : `Gõ từ ${pack?.name || 'tiếng Anh'}...`}
          disabled={status !== 'typing'}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />

        {status === 'typing' && (
          <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: '8px' }}>
            {hinted
              ? `💡 Gợi ý: từ này có ${current.answer.length} ký tự, bắt đầu bằng "${current.answer[0].toUpperCase()}" (${MAX_ATTEMPTS - attempts} lượt còn lại)`
              : `Còn ${MAX_ATTEMPTS - attempts} lần thử • ${current.answer.length} ký tự`}
          </div>
        )}

        {status === 'correct' && (
          <div className="fade-in" style={{ marginTop: '12px' }}>
            <p style={{ color: 'var(--accent-green)', fontWeight: '700' }}>✅ Chính xác!</p>
            <p className="text-secondary" style={{ fontSize: '0.88rem', fontStyle: 'italic', marginTop: '4px' }}>
              "{current.example}"
            </p>
          </div>
        )}
        {status === 'revealed' && (
          <div className="fade-in" style={{ marginTop: '12px' }}>
            <p style={{ color: 'var(--accent-red)', fontWeight: '700' }}>
              ❌ Đáp án: <span style={{ color: 'var(--accent-green)' }}>{current.answer}</span>
            </p>
            <p className="text-secondary" style={{ fontSize: '0.88rem', fontStyle: 'italic', marginTop: '4px' }}>
              "{current.example}"
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {status === 'typing' ? (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setHinted(true)}
              disabled={hinted}
            >
              💡 Gợi ý
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={check}
              disabled={!input.trim()}
            >
              Kiểm tra
            </button>
            <button className="btn btn-secondary" onClick={() => setStatus('revealed')}>
              Bỏ qua
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={next}>
            {index < queue.length - 1 ? 'Từ tiếp theo →' : 'Xem kết quả 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
