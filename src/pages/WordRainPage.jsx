import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { speak } from '../lib/speech';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

const DIFFS = {
  easy: { label: '😌 Dễ', desc: 'Từ rơi chậm, 5 mạng', speed: 0.026, spawn: 3300, lives: 5, color: 'var(--accent-green)' },
  normal: { label: '🙂 Trung bình', desc: 'Tốc độ & mật độ cân bằng', speed: 0.048, spawn: 2400, lives: 4, color: 'var(--accent-yellow)' },
  hard: { label: '🔥 Khó', desc: 'Từ rơi nhanh, 3 mạng', speed: 0.07, spawn: 1800, lives: 3, color: 'var(--accent-red)' },
};

const MAX_ITEMS = 9;
const POPUP_MS = 1600;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool(topicId, vocabulary) {
  if (topicId === 'all') {
    return Object.entries(vocabulary).flatMap(([tid, ws]) => ws.map(w => ({ ...w, topicId: tid })));
  }
  return (vocabulary[topicId] || []).map(w => ({ ...w, topicId }));
}

// Tiếng Nhật gõ bằng romaji (bỏ khoảng trắng), tiếng Anh gõ bằng chính từ.
function answerOf(w) {
  return w.romaji ? w.romaji.replace(/\s+/g, '') : w.word;
}

function buildLetterStock() {
  return LETTERS.split('').map(ch => ({ ch }));
}

function updateGame(g, dt) {
  if (!g || g.status !== 'playing') return g;

  const t = g.t + dt;
  const scale = Math.min(1 + Math.floor(t / 20000) * 0.22, 3);
  const s = DIFFS[g.difficulty] || DIFFS.normal;

  const moved = [];
  let missed = 0;
  for (const w of g.words) {
    if (w.status !== 'falling') continue;
    const y = w.y + (w.speed * scale * dt) / 1000;
    if (y >= 1) {
      missed += 1;
      continue;
    }
    moved.push({ ...w, y });
  }

  const popups = g.popups.filter(p => t - p.born < POPUP_MS);

  const pool = g.pool.slice();
  let spawnAt = g.spawnAt;
  if (pool.length === 0) {
    pool.push(...shuffleArray(g.stock));
    spawnAt = t + s.spawn * 0.8;
  }

  const lettersBonus = g.mode === 'letters' ? 1.25 : 1;
  const rook = [];
  while (t >= spawnAt && moved.length + rook.length < MAX_ITEMS && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    const base = pool[i];
    pool.splice(i, 1);
    rook.push({
      ...base,
      label: g.mode === 'letters' ? base.ch.toUpperCase() : base.word,
      uid: g.uidSeq + rook.length + 1,
      x: 6 + Math.random() * 84,
      y: -0.16,
      speed: s.speed * lettersBonus * (0.85 + Math.random() * 0.5),
      matched: 0,
      status: 'falling',
    });
    spawnAt += s.spawn * (0.85 + Math.random() * 0.35);
  }

  const lives = Math.max(0, g.lives - missed);

  return {
    ...g,
    t,
    words: [...moved, ...rook],
    popups,
    pool,
    spawnAt,
    uidSeq: g.uidSeq + rook.length,
    lives,
    missedTotal: g.missedTotal + missed,
    lastMiss: missed > 0 ? t : g.lastMiss,
    scale,
    status: lives > 0 ? 'playing' : 'over',
  };
}

function destroyWord(g, w) {
  const pts = 10 + w.word.replace(/\s+/g, '').length * 2 + Math.round((1 - w.y) * 8);
  return {
    ...g,
    uidSeq: g.uidSeq + 1,
    words: g.words.filter(x => x.uid !== w.uid),
    popups: [
      ...g.popups.filter(p => g.t - p.born < POPUP_MS),
      { uid: g.uidSeq + 1, x: w.x, y: w.y, meaning: w.meaning, pronunciation: w.pronunciation, romaji: w.romaji, born: g.t },
    ],
    score: g.score + pts,
    typedCount: g.typedCount + 1,
  };
}

function destroyLetter(g, w, ch, ok) {
  const pts = 5 + Math.round((1 - w.y) * 5);
  return {
    ...g,
    uidSeq: g.uidSeq + 1,
    words: g.words.filter(x => x.uid !== w.uid),
    score: g.score + pts,
    lettersHit: (g.lettersHit || 0) + 1,
    lastKey: { ch, ok, at: g.t },
  };
}

export default function WordRainPage() {
  const { topics, vocabulary } = useLanguage();
  const { markKnown } = useApp();
  const [phase, setPhase] = useState('mode'); // 'mode' | 'topic' | 'config' | 'playing'
  const [mode, setMode] = useState('vocab'); // 'vocab' | 'letters'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');
  const [game, setGame] = useState(null);
  const [typed, setTyped] = useState('');
  const [paused, setPaused] = useState(false);

  const gameRef = useRef(null);
  const typedRef = useRef('');
  const pausedRef = useRef(false);
  const inputRef = useRef(null);
  const prevStatusRef = useRef(null);

  const bestKey = mode === 'letters'
    ? `wordRainBest:letters:${difficulty}`
    : `wordRainBest:${selectedTopic}:${difficulty}`;

  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { typedRef.current = typed; }, [typed]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    let raf = 0;
    let last = performance.now();
    const step = (now) => {
      if (!pausedRef.current) {
        const dt = now - last;
        last = now;
        setGame(g => (g && g.status === 'playing' ? updateGame(g, dt) : g));
      } else {
        last = now;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && game?.status === 'playing' && !paused) {
      inputRef.current?.focus();
    }
  }, [phase, paused, game]);

  useEffect(() => {
    if (game?.status === 'over' && prevStatusRef.current !== 'over' && game.score > 0) {
      const prev = Number(localStorage.getItem(bestKey) || 0);
      if (game.score > prev) localStorage.setItem(bestKey, String(game.score));
    }
    prevStatusRef.current = game?.status || null;
  }, [game, bestKey]);

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
  }, []);

  const award = useCallback((w) => {
    markKnown(w.topicId, w.id);
    speak(w.word, 0.9);
  }, [markKnown]);

  const start = useCallback(() => {
    const stock = mode === 'letters' ? buildLetterStock() : shuffleArray(buildPool(selectedTopic || 'all', vocabulary));
    setGame({
      status: 'playing',
      mode,
      difficulty,
      stock,
      pool: shuffleArray(stock),
      words: [],
      popups: [],
      score: 0,
      typedCount: 0,
      lettersHit: 0,
      missedTotal: 0,
      lives: DIFFS[difficulty].lives,
      t: 0,
      spawnAt: 700,
      lastMiss: -(POPUP_MS + 1000),
      lastKey: null,
      uidSeq: 0,
      scale: 1,
    });
    setTyped('');
    typedRef.current = '';
    pausedRef.current = false;
    setPaused(false);
    setPhase('playing');
  }, [mode, selectedTopic, difficulty, vocabulary]);

  const handleTyping = useCallback((text) => {
    setTyped(text);
    const g = gameRef.current;
    if (!g || g.status !== 'playing' || pausedRef.current) return;

    const lower = text.toLowerCase().replace(/\s+/g, '');
    const full = g.words.find(w => w.status === 'falling' && answerOf(w).toLowerCase() === lower);
    if (full) {
      setGame(prev => (prev ? destroyWord(prev, full) : prev));
      award(full);
      setTyped('');
      typedRef.current = '';
      return;
    }

    const target = lower
      ? g.words.find(w => w.status === 'falling' && answerOf(w).toLowerCase().startsWith(lower))
      : null;
    setGame(prev => (prev
      ? {
          ...prev,
          words: prev.words.map(w => {
            if (w.status !== 'falling') return w;
            const ratio = target?.uid === w.uid ? Math.min(1, lower.length / answerOf(w).length) : 0;
            const nm = Math.round(ratio * w.label.length);
            return nm === w.matched ? w : { ...w, matched: nm };
          }),
        }
      : prev));
  }, [award]);

  const handleInputKey = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const g = gameRef.current;
      const text = typedRef.current;
      if (!g || g.status !== 'playing' || pausedRef.current || !text.trim()) return;
      const lower = text.toLowerCase().replace(/\s+/g, '');
      const target = g.words.find(w => w.status === 'falling' && answerOf(w).toLowerCase().startsWith(lower));
      if (target) {
        setGame(prev => (prev ? destroyWord(prev, target) : prev));
        award(target);
        setTyped('');
        typedRef.current = '';
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      togglePause();
    }
  }, [award, togglePause]);

  const handleLetter = useCallback((ch) => {
    const g = gameRef.current;
    if (!g || g.status !== 'playing' || pausedRef.current) return;
    const candidates = g.words.filter(w => w.status === 'falling' && w.ch === ch);
    if (candidates.length === 0) {
      setGame(prev => (prev ? { ...prev, lastKey: { ch, ok: false, at: prev.t } } : prev));
      return;
    }
    const target = candidates.reduce((a, b) => (b.y > a.y ? b : a), candidates[0]);
    setGame(prev => (prev ? destroyLetter(prev, target, ch, true) : prev));
  }, []);

  useEffect(() => {
    if (phase !== 'playing' || mode !== 'letters') return undefined;
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
        return;
      }
      const tgt = e.target;
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA')) return;
      const ch = e.key.length === 1 ? e.key.toLowerCase() : null;
      if (!ch || !LETTERS.includes(ch)) return;
      e.preventDefault();
      handleLetter(ch);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, mode, togglePause, handleLetter]);

  // ---- MODE SELECT ----
  if (phase === 'mode') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">⌨️ Mưa từ vựng</h1>
          <p className="page-subtitle">Chọn chế độ chơi — từ rơi từ trên xuống, gõ để bắn hạ!</p>
        </div>

        <div className="topic-grid">
          <div
            className="topic-card"
            style={{ '--topic-gradient': 'var(--gradient-hero)' }}
            onClick={() => { setMode('vocab'); setPhase('topic'); }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-hero)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            <div className="topic-icon">📖</div>
            <div className="topic-name">Mưa từ vựng</div>
            <div className="topic-count">Gõ đúng từ tiếng Anh — xem nghĩa tiếng Việt khi trúng</div>
          </div>
          <div
            className="topic-card"
            style={{ '--topic-gradient': 'var(--gradient-card)' }}
            onClick={() => { setMode('letters'); setPhase('config'); }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(135deg, #29B6F6, #38c6e8)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            <div className="topic-icon">🔤</div>
            <div className="topic-name">Luyện gõ phím</div>
            <div className="topic-count">Chữ cái rơi từng cái — gõ đúng chữ để bắn hạ</div>
          </div>
        </div>
      </div>
    );
  }

  // ---- TOPIC SELECT ----
  if (phase === 'topic') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }} onClick={() => setPhase('mode')}>← Chọn chế độ</button>
          <h1 className="page-title">📖 Mưa từ vựng</h1>
          <p className="page-subtitle">Chọn chủ đề từ vựng để chơi</p>
        </div>

        <div className="topic-grid">
          <div
            key="all"
            className="topic-card"
            style={{ '--topic-gradient': 'var(--gradient-hero)' }}
            onClick={() => { setSelectedTopic('all'); setPhase('config'); }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-hero)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            <div className="topic-icon">🎲</div>
            <div className="topic-name">Trộn tất cả</div>
            <div className="topic-count">Hỗn hợp mọi chủ đề</div>
          </div>
          {topics.map(topic => (
            <div
              key={topic.id}
              className="topic-card"
              style={{ '--topic-gradient': topic.gradient }}
              onClick={() => { setSelectedTopic(topic.id); setPhase('config'); }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: topic.gradient, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
              <div className="topic-icon">{topic.icon}</div>
              <div className="topic-name">{topic.name}</div>
              <div className="topic-count">{(vocabulary[topic.id] || []).length} từ</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- CONFIG PHASE ----
  if (phase === 'config') {
    const wordCount = selectedTopic === 'all'
      ? Object.values(vocabulary).reduce((a, b) => a + b.length, 0)
      : (vocabulary[selectedTopic] || []).length;
    const topic = topics.find(t => t.id === selectedTopic);
    const label = mode === 'letters'
      ? '🔤 Luyện gõ phím'
      : selectedTopic === 'all' ? '🎲 Trộn tất cả' : `${topic?.icon || ''} ${topic?.name || ''}`;
    const bestOfDifficulty = Number(localStorage.getItem(bestKey) || 0);

    return (
      <div className="fade-in">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }} onClick={() => setPhase(mode === 'letters' ? 'mode' : 'topic')}>← Quay lại</button>
          <h1 className="page-title">⚙️ Cấu hình game</h1>
          <p className="page-subtitle">{label}{mode !== 'letters' ? ` • ${wordCount} từ có sẵn` : ''}</p>
        </div>

        <div className="card" style={{ maxWidth: '560px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Độ khó</h2>
          <div className="flex gap-md" style={{ flexWrap: 'wrap', marginBottom: '24px' }}>
            {Object.entries(DIFFS).map(([key, d]) => (
              <button
                key={key}
                className={`diff-card ${difficulty === key ? 'selected' : ''}`}
                style={{ '--diff-color': d.color }}
                onClick={() => setDifficulty(key)}
              >
                <span className="diff-label">{d.label}</span>
                <span className="diff-desc">{d.desc}</span>
              </button>
            ))}
          </div>

          {bestOfDifficulty > 0 && (
            <div className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              🏆 Kỷ lục của bạn ở độ khó này: {bestOfDifficulty} điểm
            </div>
          )}

          <button className="btn btn-primary btn-lg w-full" onClick={start}>🚀 Bắt đầu game</button>
        </div>
      </div>
    );
  }

  // ---- PLAYING PHASE ----
  if (!game) return null;
  const { status, score, lives, missedTotal } = game;
  const diff = DIFFS[game.difficulty] || DIFFS.normal;
  const hits = mode === 'letters' ? (game.lettersHit || 0) : game.typedCount;
  const storedBest = Number(localStorage.getItem(bestKey) || 0);
  const curBest = Math.max(storedBest, score);
  const isNewBest = status === 'over' && score > storedBest;
  const total = hits + missedTotal;
  const accuracy = total > 0 ? Math.round((hits / total) * 100) : 100;
  const hearts = '❤️'.repeat(lives) + '🤍'.repeat(diff.lives - lives);
  const topic = topics.find(t => t.id === selectedTopic);
  const subtitle = mode === 'letters'
    ? '🔤 Luyện gõ phím'
    : `${topic?.icon || ''} ${topic?.name || ''}`;
  const activeLetters = new Set(game.words.filter(w => w.status === 'falling').map(w => w.ch));
  const freshKey = game.lastKey && (game.t - game.lastKey.at < 280) ? game.lastKey : null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">⌨️ {mode === 'letters' ? 'Luyện gõ phím' : 'Mưa từ vựng'}</h1>
        <p className="page-subtitle">{subtitle} • {diff.label}</p>
      </div>

      <div className="game-shell">
        <div className="game-hud">
          <div className="game-stat">
            <span className="game-stat-label">Điểm</span>
            <span className="game-stat-value">{score}</span>
          </div>
          <div className="game-stat">
            <span className="game-stat-label">Mạng</span>
            <span className="game-stat-value" style={{ fontSize: '1rem' }}>{hearts}</span>
          </div>
          <div className="game-stat">
            <span className="game-stat-label">{mode === 'letters' ? '🔤 Chữ đúng' : 'Bắn hạ'}</span>
            <span className="game-stat-value">{hits}</span>
          </div>
          <div className="game-stat">
            <span className="game-stat-label">Kỷ lục</span>
            <span className="game-stat-value">{curBest}</span>
          </div>
          <div className="game-hud-actions">
            {status === 'playing' && (
              <button className="btn btn-secondary btn-sm" onClick={togglePause}>
                {paused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => { setGame(null); setPhase('config'); }}>✕ Thoát</button>
          </div>
        </div>

        <div className="game-board" onClick={() => inputRef.current?.focus()}>
          <div className="game-ground" />

          {game.words.map(w => (
            <div
              key={w.uid}
              className={`game-word ${w.matched > 0 ? 'active' : ''} ${mode === 'letters' ? 'game-letter' : ''}`}
              style={{ left: `${w.x}%`, top: `${w.y * 100}%` }}
            >
              {w.label.split('').map((ch, i) => (
                <span key={i} className={i < w.matched ? 'wl-on' : 'wl-off'}>{ch === ' ' ? '\u00A0' : ch}</span>
              ))}
            </div>
          ))}

          {mode === 'vocab' && game.popups.map(p => (
            <div key={p.uid} className="game-popup" style={{ left: `${p.x}%`, top: `${p.y * 100}%` }}>
              <div className="game-popup-vi">{p.meaning}</div>
              <div className="game-popup-pron">{p.pronunciation || p.romaji}</div>
            </div>
          ))}

          {status === 'playing' && game.t - game.lastMiss < 380 && (
            <div key={game.lastMiss} className="game-damage" />
          )}

          {status === 'playing' && paused && (
            <div className="game-paused">⏸️ Tạm dừng</div>
          )}

          {status === 'over' && (
            <div className="game-overlay">
              <div className="game-over-card">
                <div className="completion-emoji">💥</div>
                <h2 className="completion-title">Hết game!</h2>
                <p className="text-secondary">Quá nhiều {mode === 'letters' ? 'chữ cái' : 'từ'} đã chạm đáy 😅</p>
                <div className="completion-stats">
                  <div className="completion-stat">
                    <div className="completion-stat-value">{score}</div>
                    <div className="completion-stat-label">Điểm</div>
                  </div>
                  <div className="completion-stat">
                    <div className="completion-stat-value">{hits}</div>
                    <div className="completion-stat-label">{mode === 'letters' ? 'Chữ gõ đúng' : 'Từ bắn hạ'}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="completion-stat-value">{accuracy}%</div>
                    <div className="completion-stat-label">Chính xác</div>
                  </div>
                </div>
                {isNewBest && (
                  <div className="badge badge-yellow" style={{ marginBottom: '16px' }}>🏆 Kỷ lục mới: {score} điểm!</div>
                )}
                <div className="flex gap-md" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => { setGame(null); setPhase('config'); }}>⚙️ Chọn chủ đề / độ khó</button>
                  <button className="btn btn-primary" onClick={start}>🔄 Chơi lại</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {mode === 'vocab' ? (
          <div className="game-console">
            <input
              ref={inputRef}
              className="game-input"
              type="text"
              value={typed}
              onChange={e => handleTyping(e.target.value)}
              onKeyDown={handleInputKey}
              placeholder="Gõ từ tiếng Anh đang rơi..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              autoFocus
              disabled={status === 'over'}
            />
            <div className="game-hint">
              Gõ chữ cái đầu để khoá mục tiêu, gõ tiếp để bắn hạ. Nhấn <strong>Enter</strong> để hoàn thành từ đang khoá. Từ nào chạm đáy sẽ trừ 1 mạng!
            </div>
          </div>
        ) : (
          <div className="game-console">
            <div className="kb">
              {KEY_ROWS.map(row => (
                <div key={row} className="kb-row">
                  {row.split('').map(ch => {
                    let cls = 'kb-key';
                    if (activeLetters.has(ch)) cls += ' active';
                    if (freshKey && freshKey.ch === ch) cls += freshKey.ok ? ' hit' : ' miss';
                    return (
                      <button
                        key={ch}
                        type="button"
                        className={cls}
                        onPointerDown={e => {
                          e.preventDefault();
                          handleLetter(ch);
                        }}
                        aria-label={`Phím ${ch.toUpperCase()}`}
                      >
                        {ch.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="game-hint">
              Gõ bằng phím vật lý hoặc <strong>chạm phím</strong> trên màn hình để bắn chữ cái đang rơi. Phím có chữ đang rơi sẽ sáng lên — bắn nhanh để nhiều điểm!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}