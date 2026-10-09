import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { shuffle, pickRandom } from '../lib/gameUtils';
import { latinEqual, japaneseEqual } from '../lib/langUtils';
import { tokenizeSentence, playableSentences } from '../lib/sentenceUtils';
import { speak } from '../lib/speech';

const COUNT_OPTIONS = [4, 6, 8];
const MAX_ATTEMPTS = 2;

export default function SentenceBuilderPage() {
  const { dailySentences, isJapanese } = useLanguage();
  const { addQuizScore } = useApp();
  const [phase, setPhase] = useState('select');
  const [count, setCount] = useState(6);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [chosen, setChosen] = useState([]); // chỉ số trong `shuffled`
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('typing'); // 'typing' | 'correct' | 'revealed'
  const [solved, setSolved] = useState(0);
  const [missed, setMissed] = useState([]);

  const current = queue[index] || null;
  // Tiếng Nhật chỉ nhận câu tách ra ≥3 mẩu, nếu không game quá dễ.
  const pool = useMemo(
    () => playableSentences(dailySentences, isJapanese),
    [dailySentences, isJapanese],
  );
  const built = useMemo(
    () => chosen.map(i => shuffled[i]).join(isJapanese ? '' : ' '),
    [chosen, shuffled, isJapanese],
  );

  const loadQuestion = (i) => {
    const s = queue[i];
    setShuffled(shuffle(tokenizeSentence(s.en, isJapanese)));
    setChosen([]);
    setAttempts(0);
    setStatus('typing');
  };

  const start = () => {
    const picked = pickRandom(pool, count);
    if (picked.length === 0) return;
    setQueue(picked);
    setIndex(0);
    setSolved(0);
    setMissed([]);
    setPhase('play');
    setShuffled(shuffle(tokenizeSentence(picked[0].en, isJapanese)));
    setChosen([]);
    setAttempts(0);
    setStatus('typing');
  };

  const chooseChip = (i) => {
    if (status !== 'typing') return;
    setChosen(prev => [...prev, i]);
  };

  const removeLast = () => {
    if (status !== 'typing') return;
    setChosen(prev => prev.slice(0, -1));
  };

  const check = () => {
    if (!current || status !== 'typing' || chosen.length === 0) return;
    const ok = isJapanese ? japaneseEqual(built, current.en) : latinEqual(built, current.en);
    if (ok) {
      setStatus('correct');
      setSolved(s => s + 1);
      speak(current.en, 0.85);
    } else if (attempts + 1 >= MAX_ATTEMPTS) {
      setStatus('revealed');
      setMissed(m => [...m, current]);
    } else {
      setAttempts(a => a + 1);
    }
  };

  const skip = () => {
    if (status !== 'typing') return;
    setStatus('revealed');
    setMissed(m => [...m, current]);
  };

  const next = () => {
    if (index < queue.length - 1) {
      setIndex(i => i + 1);
      loadQuestion(index + 1);
    } else {
      addQuizScore(solved, queue.length, 'game:sentence-builder');
      setPhase('done');
    }
  };

  // ---- CHỌN SỐ CÂU ----
  if (phase === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <Link to="/games" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }}>← Game khác</Link>
          <h1 className="page-title">🧩 Xếp câu</h1>
          <p className="page-subtitle">
            Xếp các từ bị xáo trộn thành câu hoàn chỉnh — {pool.length} câu giao tiếp sẵn có
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '28px', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: '10px' }}>🧩</div>
          <p className="text-secondary" style={{ marginBottom: '18px' }}>
            Bạn sẽ thấy nghĩa tiếng Việt — hãy lắp các từ {isJapanese ? 'tiếng Nhật' : 'tiếng Anh'} thành câu đúng.
            Mỗi câu có 2 lần thử.
          </p>
          <div className="flex gap-sm" style={{ justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {COUNT_OPTIONS.map(n => (
              <button
                key={n}
                className={`btn ${count === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCount(n)}
                disabled={n > pool.length}
              >
                {n} câu
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-lg w-full" onClick={start}>
            🚀 Bắt đầu
          </button>
        </div>
      </div>
    );
  }

  // ---- KẾT QUẢ ----
  if (phase === 'done') {
    const pct = Math.round((solved / queue.length) * 100);
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">{pct >= 80 ? 'Xếp câu xuất sắc!' : pct >= 60 ? 'Khá ổn!' : 'Cần luyện thêm!'}</h2>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{solved}</div>
            <div className="completion-stat-label">Câu đúng ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>{queue.length - solved}</div>
            <div className="completion-stat-label">Câu sai ❌</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>{pct}%</div>
            <div className="completion-stat-label">Điểm</div>
          </div>
        </div>

        {missed.length > 0 && (
          <div style={{ width: '100%', maxWidth: '520px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>📌 Câu cần xem lại</h3>
            {missed.map((s, i) => (
              <div key={s.id ?? i} className="grammar-example" style={{ marginBottom: '8px' }}>
                <span className="grammar-example-arrow">✓</span>
                <span>
                  <strong>{s.en}</strong>
                  <br />
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{s.vi}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={start}>🔄 Chơi lại</button>
          <button className="btn btn-primary" onClick={() => setPhase('select')}>🧩 Chơi số câu khác</button>
        </div>
      </div>
    );
  }

  // ---- TRÒ CHƠI ----
  if (!current) return null;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPhase('select')}>← Thoát</button>
        <div className="badge badge-purple">🧩 {current.tag}</div>
        <div style={{ marginLeft: 'auto' }} className="badge badge-yellow">✅ {solved}/{queue.length}</div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>

      <div className="card sb-card">
        <div className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
          Câu {index + 1}/{queue.length} — sắp xếp thành câu có nghĩa:
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
          fontWeight: '800',
          marginBottom: '16px',
        }}>
          {current.vi}
        </div>

        {/* Vùng lắp câu */}
        <div className="sb-answer" onClick={() => { if (status === 'typing' && chosen.length) removeLast(); }}>
          {chosen.length === 0 ? (
            <span className="text-muted" style={{ fontSize: '0.88rem' }}>
              Chạm vào các từ bên dưới để lắp câu (chạm lần nữa để bỏ từ cuối)
            </span>
          ) : (
            chosen.map((ci, pos) => (
              <span key={`${ci}-${pos}`} className="sb-chip chosen">{shuffled[ci]}</span>
            ))
          )}
        </div>

        {/* Kho từ */}
        <div className="sb-bank">
          {shuffled.map((w, i) => {
            const used = chosen.includes(i);
            return (
              <button
                key={`${w}-${i}`}
                className={`sb-chip ${used ? 'used' : ''}`}
                onClick={() => chooseChip(i)}
                disabled={used || status !== 'typing'}
              >
                {w}
              </button>
            );
          })}
        </div>

        {status === 'correct' && (
          <div className="fade-in" style={{ marginTop: '14px' }}>
            <p style={{ color: 'var(--accent-green)', fontWeight: '700' }}>✅ Chính xác!</p>
            <p className="text-secondary" style={{ fontSize: '0.88rem', fontStyle: 'italic', marginTop: '4px' }}>
              {current.grammar?.name ? `${current.grammar.name} — ` : ''}{current.en}
            </p>
          </div>
        )}
        {status === 'revealed' && (
          <div className="fade-in" style={{ marginTop: '14px' }}>
            <p style={{ color: 'var(--accent-red)', fontWeight: '700' }}>❌ Đáp án đúng:</p>
            <p style={{ color: 'var(--accent-green)', fontWeight: '600', marginTop: '4px' }}>{current.en}</p>
          </div>
        )}
        {status === 'typing' && (
          <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: '10px' }}>
            Còn {MAX_ATTEMPTS - attempts} lần thử
          </div>
        )}
      </div>

      <div className="flex gap-md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {status === 'typing' ? (
          <>
            <button className="btn btn-secondary" onClick={removeLast} disabled={chosen.length === 0}>
              ↺ Bỏ từ cuối
            </button>
            <button className="btn btn-primary btn-lg" onClick={check} disabled={chosen.length === 0}>
              ✅ Kiểm tra
            </button>
            <button className="btn btn-secondary" onClick={skip}>
              Bỏ qua
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={next}>
            {index < queue.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
