import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams } from 'react-router-dom';

const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');

export default function GrammarPage() {
  const { grammarLessons } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const selectedId = rawId && grammarLessons.some(l => l.id === rawId) ? rawId : null;
  const [attempts, setAttempts] = useState({});
  const [cloze, setCloze] = useState({});
  const [prevId, setPrevId] = useState(selectedId);

  // Reset answers when the lesson changes (derived state pattern)
  if (selectedId !== prevId) {
    setPrevId(selectedId);
    setAttempts({});
    setCloze({});
  }

  const openLesson = (id) => {
    setAttempts({});
    setCloze({});
    setSearchParams({ id });
  };

  const lesson = grammarLessons.find(l => l.id === selectedId);
  const currentIdx = lesson ? grammarLessons.findIndex(l => l.id === lesson.id) : -1;

  const recordAnswer = (qIdx, optIdx) => {
    setAttempts(prev => ({ ...prev, [`${lesson.id}-${qIdx}`]: optIdx }));
  };

  const checkCloze = (cIdx, value) => {
    setCloze(prev => ({ ...prev, [`${lesson.id}-${cIdx}`]: { draft: value, checked: true } }));
  };

  const setDraft = (cIdx, value) => {
    setCloze(prev => {
      const existing = prev[`${lesson.id}-${cIdx}`];
      if (existing?.checked) return prev;
      return { ...prev, [`${lesson.id}-${cIdx}`]: { draft: value, checked: false } };
    });
  };

  // ---- LESSON LIST ----
  if (!lesson) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">📘 Ngữ pháp</h1>
          <p className="page-subtitle">Chọn một chủ điểm ngữ pháp để học và làm bài tập</p>
        </div>

        <div className="grammar-grid">
          {grammarLessons.map(item => (
            <div
              key={item.id}
              className="grammar-card"
              onClick={() => openLesson(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="grammar-icon">{item.icon}</span>
                <span className="badge badge-purple">{item.tag}</span>
              </div>
              <div className="grammar-title">{item.title}</div>
              <div className="grammar-desc">
                {item.explanation.split('\n')[0]}
              </div>
              <div className="grammar-start">Học bài →</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- LESSON DETAIL ----
  const safeIdx = Math.max(0, currentIdx);

  const renderCloze = () => {
    if (!lesson.cloze || lesson.cloze.length === 0) return null;
    return (
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>🖊️ Điền từ còn thiếu</h2>
        {lesson.cloze.map((c, cIdx) => {
          const key = `${lesson.id}-${cIdx}`;
          const entry = cloze[key];
          const draft = entry?.draft ?? '';
          const given = !!entry?.checked;
          const correct = given && normalize(draft) === normalize(c.answer);
          return (
            <div key={cIdx} style={{
              padding: '20px',
              marginBottom: '16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}>
              <p style={{ fontWeight: '600', marginBottom: '12px' }}>
                {cIdx + 1}. {c.sentence.replace('___', '______')}
              </p>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <input
                  className="listen-input"
                  style={{ flex: '1 1 220px', borderColor: given ? (correct ? 'var(--accent-green)' : 'var(--accent-red)') : undefined }}
                  placeholder="Gõ đáp án..."
                  value={draft}
                  onChange={e => setDraft(cIdx, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') checkCloze(cIdx, draft); }}
                  disabled={given}
                />
                {!given && (
                  <button className="btn btn-secondary" onClick={() => checkCloze(cIdx, draft)}>Kiểm tra</button>
                )}
              </div>
              {given && (
                <p className="fade-in" style={{
                  marginTop: '12px', fontSize: '0.9rem', padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: correct ? 'rgba(31,157,97,0.12)' : 'rgba(223,59,79,0.12)',
                  color: correct ? 'var(--accent-green)' : 'var(--accent-red)',
                }}>
                  {correct ? '✅ Đúng rồi! ' : `❌ Đáp án: ${c.answer}. `}
                  <span className="text-secondary">{c.note || ''}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setAttempts({});
              setCloze({});
              setSearchParams({});
            }}
          >
            ← Danh sách
          </button>
          <span className="badge badge-purple">{lesson.tag}</span>
        </div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>{lesson.icon}</span> {lesson.title}
        </h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>📖 Cách dùng</h2>
        {lesson.explanation.split('\n').map((line, i) => (
          <p key={i} className="text-secondary" style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{line}</p>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>🧾 Công thức</h2>
        <div className="grammar-formula-list">
          {lesson.formula.map((f, i) => {
            const text = typeof f === 'string' ? f : f.text;
            const reading = typeof f === 'string' ? '' : f.reading;
            return (
              <div key={i} className="grammar-formula">
                <span>{text}</span>
                {reading && <span className="grammar-reading">{reading}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {lesson.signals && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>🔔 Từ nhận diện thì</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {lesson.signals.map((grp, i) => (
              <div key={i}>
                <div className="grammar-formula" style={{ marginBottom: '8px' }}>{grp.tense}</div>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                  {grp.words.map((w, wi) => (
                    <span key={wi} className={`signal-chip ${i === 0 ? 'signal-chip-a' : 'signal-chip-b'}`}>{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>💬 Ví dụ</h2>
        <div className="grammar-example-list">
          {lesson.examples.flat().map((ex, i) => (
            <div key={i} className="grammar-example">
              <span className="grammar-example-arrow">→</span>
              {typeof ex === 'string' ? (
                <span>{ex}</span>
              ) : (
                <span className="grammar-example-stack">
                  <span className="grammar-example-jp">{ex.jp}</span>
                  {ex.reading && <span className="grammar-example-reading">{ex.reading}</span>}
                  <span className="grammar-example-vi">{ex.vi}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>✏️ Luyện tập</h2>
        {lesson.practice.map((p, qi) => {
          const attemptKey = `${lesson.id}-${qi}`;
          const chosen = attempts[attemptKey];
          const answered = chosen !== undefined;
          return (
            <div key={qi} style={{ padding: '20px', marginBottom: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: '600', marginBottom: '14px' }}>{qi + 1}. {p.q}</p>
              <div className="quiz-options" style={{ marginTop: '0' }}>
                {p.options.map((opt, oi) => {
                  let cls = 'quiz-option';
                  if (answered) {
                    cls += ' disabled';
                    if (oi === p.answerIndex) cls += ' correct';
                    else if (oi === chosen) cls += ' wrong';
                  }
                  return (
                    <button key={oi} className={cls} onClick={() => recordAnswer(qi, oi)}>
                      {answered && oi === p.answerIndex && '✅ '}
                      {answered && oi === chosen && oi !== p.answerIndex && '❌ '}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p className={`fade-in text-secondary`} style={{
                  marginTop: '14px', fontSize: '0.9rem', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: chosen === p.answerIndex ? 'rgba(31,157,97,0.12)' : 'rgba(223,59,79,0.12)',
                  color: chosen === p.answerIndex ? 'var(--accent-green)' : 'var(--accent-red)',
                }}>
                  {chosen === p.answerIndex ? '✅ Đúng! ' : '❌ Sai rồi. '}
                  {p.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {renderCloze()}

      <div className="flex gap-md" style={{ marginBottom: '24px' }}>
        {currentIdx > 0 && (
          <button className="btn btn-secondary" onClick={() => openLesson(grammarLessons[safeIdx - 1].id)}>
            ← {grammarLessons[safeIdx - 1].title}
          </button>
        )}
        {currentIdx < grammarLessons.length - 1 && (
          <button className="btn btn-primary" onClick={() => openLesson(grammarLessons[safeIdx + 1].id)}>
            {grammarLessons[safeIdx + 1].title} →
          </button>
        )}
      </div>
    </div>
  );
}