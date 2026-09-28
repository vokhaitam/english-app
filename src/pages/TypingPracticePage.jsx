import React, { useState, useRef, useEffect } from 'react';
import { topics, vocabulary } from '../data/vocabulary';
import { useApp } from '../context/AppContext';
import { speak } from '../lib/speech';

const TYPE_LABELS = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  number: 'Số thứ tự',
  phrase: 'Cụm từ',
  preposition: 'Giới từ',
};

const TONE_MARKS = /[\u0300-\u036f]/g;

function norm(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]/g, '')
    .replace(/[’‘`]/g, "'")
    .trim();
}

function stripTone(s) {
  return s
    .normalize('NFD')
    .replace(TONE_MARKS, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function equalLenient(input, target) {
  const a = norm(input);
  const b = norm(target);
  if (!a || !b) return false;
  if (a === b) return true;
  const aNoTone = stripTone(a);
  const bNoTone = stripTone(b);
  return aNoTone === bNoTone || a === bNoTone || aNoTone === b;
}

function meaningChecks(meaning) {
  const noParens = meaning.replace(/[()（）][^)）]*[)）]/g, '').trim();
  const segs = meaning.split(/[,;•/]/).map(s => s.trim()).filter(Boolean);
  return [...new Set([meaning, noParens, ...segs])].filter(Boolean);
}

function isViAnswer(input, meaning) {
  return meaningChecks(meaning).some(seg => equalLenient(input, seg));
}

function isEnAnswer(input, word) {
  return equalLenient(input, word) || equalLenient(input, word.replaceAll("'", ''));
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool(topicId) {
  if (topicId === 'all') {
    return Object.entries(vocabulary).flatMap(([tid, ws]) => ws.map(w => ({ ...w, topicId: tid })));
  }
  return (vocabulary[topicId] || []).map(w => ({ ...w, topicId }));
}

export default function TypingPracticePage() {
  const { markKnown, markUnknown } = useApp();
  const [dir, setDir] = useState('en2vi'); // 'en2vi' | 'vi2en'
  const [phase, setPhase] = useState('topic'); // 'topic' | 'playing' | 'done'
  const [topicId, setTopicId] = useState(null);
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { ok: boolean }
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const inputRef = useRef(null);
  const awardedRef = useRef(new Set());

  const topic = topics.find(t => t.id === topicId);
  const current = pool[idx] || null;
  const total = pool.length;

  useEffect(() => {
    if (phase === 'playing') inputRef.current?.focus();
  }, [phase, idx]);

  const start = (tid) => {
    setTopicId(tid);
    setPool(shuffleArray(buildPool(tid)));
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setInput('');
    setFeedback(null);
    awardedRef.current = new Set();
    setPhase('playing');
  };

  const submit = () => {
    if (!current || feedback) return;
    const ok = dir === 'en2vi' ? isViAnswer(input, current.meaning) : isEnAnswer(input, current.word);
    if (ok) {
      const key = `${current.topicId}-${current.id}`;
      if (!awardedRef.current.has(key)) {
        awardedRef.current.add(key);
        markKnown(current.topicId, current.id);
      }
      setCorrect(c => c + 1);
      setFeedback({ ok: true });
      speak(current.word, 0.9);
    } else {
      markUnknown(current.topicId, current.id);
      setWrong(w => w + 1);
      setFeedback({ ok: false });
      if (dir === 'en2vi') speak(current.word, 0.9);
    }
  };

  const next = () => {
    if (idx >= total - 1) {
      setPhase('done');
    } else {
      setIdx(i => i + 1);
      setInput('');
      setFeedback(null);
    }
  };

  const handleKey = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (feedback) next();
    else submit();
  };

  // ---- TOPIC SELECT ----
  if (phase === 'topic') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">✍️ Luyện ghi từ</h1>
          <p className="page-subtitle">Nhìn từ tiếng Anh gõ nghĩa tiếng Việt — và ngược lại. Chọn chủ đề để bắt đầu!</p>
        </div>

        <div className="tp-dir">
          <button
            type="button"
            className={`tp-dir-btn ${dir === 'en2vi' ? 'active' : ''}`}
            onClick={() => setDir('en2vi')}
          >
            🇬🇧→🇻🇳 Nhìn Anh gõ Việt
          </button>
          <button
            type="button"
            className={`tp-dir-btn ${dir === 'vi2en' ? 'active' : ''}`}
            onClick={() => setDir('vi2en')}
          >
            🇻🇳→🇬🇧 Nhìn Việt gõ Anh
          </button>
        </div>

        <div className="topic-grid">
          <div
            className="topic-card"
            style={{ '--topic-gradient': 'linear-gradient(135deg, #e8326f, #ff9d80)' }}
            onClick={() => start('all')}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(135deg, #e8326f, #ff9d80)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            <div className="topic-icon">🔀</div>
            <div className="topic-name">Tất cả chủ đề</div>
            <div className="topic-count">
              {Object.values(vocabulary).reduce((s, ws) => s + ws.length, 0)} từ vựng
            </div>
          </div>

          {topics.map(t => {
            const count = vocabulary[t.id]?.length || 0;
            return (
              <div
                key={t.id}
                className="topic-card"
                style={{ '--topic-gradient': t.gradient }}
                onClick={() => start(t.id)}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: t.gradient, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
                <div className="topic-icon">{t.icon}</div>
                <div className="topic-name">{t.name}</div>
                <div className="topic-count">{count} từ</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- DONE ----
  if (phase === 'done') {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">
          {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👏' : '💪'}
        </div>
        <h2 className="completion-title">
          {accuracy >= 80 ? 'Xuất sắc!' : accuracy >= 60 ? 'Tốt lắm!' : 'Cố lên!'}
        </h2>
        <p className="text-secondary">
          Bạn đã hoàn thành bài luyện ghi từ{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {topicId === 'all' ? 'tất cả chủ đề' : (topic?.name || '')}
          </strong>{' '}
          (chiều {dir === 'en2vi' ? 'Anh → Việt' : 'Việt → Anh'})
        </p>

        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{correct}</div>
            <div className="completion-stat-label">Gõ đúng ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>{wrong}</div>
            <div className="completion-stat-label">Chưa đúng ❌</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>{accuracy}%</div>
            <div className="completion-stat-label">Chính xác</div>
          </div>
        </div>

        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={() => start(topicId)}>🔄 Làm lại</button>
          <button className="btn btn-primary" onClick={() => setPhase('topic')}>📚 Chủ đề khác</button>
        </div>
      </div>
    );
  }

  // ---- PLAYING ----
  const returning = dir === 'en2vi';
  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setPhase('topic')}>← Chọn chủ đề</button>
          <span className="badge badge-purple">
            {topicId === 'all' ? '🔀 Tất cả' : `${topic?.icon || ''} ${topic?.name || ''}`}
          </span>
        </div>
        <h1 className="page-title">✍️ Luyện ghi từ</h1>
        <p className="page-subtitle">
          Chiều {returning ? '🇬🇧→🇻🇳 Anh → Việt' : '🇻🇳→🇬🇧 Việt → Anh'}
        </p>
      </div>

      <div className="tp-dir" style={{ marginBottom: '16px' }}>
        <button
          type="button"
          className={`tp-dir-btn ${dir === 'en2vi' ? 'active' : ''}`}
          onClick={() => setDir('en2vi')}
        >
          🇬🇧→🇻🇳
        </button>
        <button
          type="button"
          className={`tp-dir-btn ${dir === 'vi2en' ? 'active' : ''}`}
          onClick={() => setDir('vi2en')}
        >
          🇻🇳→🇬🇧
        </button>
      </div>

      <div className="tp-progress">
        <div className="progress-bar-container" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${total > 0 ? ((idx + 1) / total) * 100 : 0}%` }} />
        </div>
        <span className="tp-progress-text">Từ {idx + 1} / {total} • ✅ {correct} • ❌ {wrong}</span>
      </div>

      <div className="card tp-card">
        <div className="tp-prompt">
          {feedback ? null : (
            <div className="tp-prompt-label">
              {returning ? 'Tiếng Anh' : 'Nghĩa tiếng Việt'}
            </div>
          )}

          {returning ? (
            <>
              <div className="tp-word">{current.word}</div>
              <div className="tp-pron">{current.pronunciation}</div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => speak(current.word, 0.9)}
                style={{ marginTop: '10px' }}
              >
                🔊 Nghe phát âm
              </button>
            </>
          ) : (
            <>
              <div className="tp-word" style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)' }}>
                {current.meaning}
              </div>
              {feedback ? (
                <div className="tp-pron" style={{ marginTop: '8px' }}>
                  {current.word} {current.pronunciation}{' '}
                  <em style={{ color: 'var(--text-muted)' }}>{TYPE_LABELS[current.type] || current.type}</em>
                </div>
              ) : null}
            </>
          )}

          {feedback && feedback.ok && (
            <div className="tp-feedback ok">
              Đúng rồi! 🎉
              {returning && <div className="tp-reveal">{current.meaning}</div>}
            </div>
          )}

          {feedback && !feedback.ok && (
            <div className="tp-feedback no">
              Chưa đúng!
              <div className="tp-reveal">
                {returning
                  ? <>Nghĩa đúng: <strong>{current.meaning}</strong></>
                  : <>Từ đúng: <strong>{current.word}</strong> {current.pronunciation}</>}
              </div>
            </div>
          )}
        </div>

        <div className="tp-input-wrap">
          <input
            ref={inputRef}
            className="tp-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={returning ? 'Gõ nghĩa tiếng Việt...' : 'Gõ từ tiếng Anh...'}
            disabled={!!feedback}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        <div className="tp-actions">
          {feedback ? (
            <button className="btn btn-primary" onClick={next}>
              {idx >= total - 1 ? '🏁 Xem kết quả' : '➡️ Tiếp theo'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submit}>✅ Kiểm tra</button>
          )}
        </div>

        <div className="tp-hint">
          {returning
            ? 'Chỉ cần gõ một nghĩa đúng; có thể gõ không dấu (vd: "xin chao" vẫn đúng). Nhấn Enter để kiểm tra nhanh.'
            : 'Gõ đúng từ tiếng Anh (không cần phân biệt hoa/thường). Nhấn Enter để kiểm tra nhanh.'}
        </div>
      </div>
    </div>
  );
}