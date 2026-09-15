import React, { useState, useEffect } from 'react';
import { vocabulary, topics } from '../data/vocabulary';
import { useApp } from '../context/AppContext';

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateOptions(correctWord, allWords) {
  const used = new Set([correctWord.word.toLowerCase(), correctWord.meaning.toLowerCase()]);
  const wrong = [];
  const pool = shuffleArray(allWords.filter(w => w.id !== correctWord.id));
  for (const w of pool) {
    if (wrong.length === 3) break;
    const wText = w.word.toLowerCase();
    const mText = w.meaning.toLowerCase();
    if (used.has(wText) || used.has(mText)) continue;
    used.add(wText);
    used.add(mText);
    wrong.push(w);
  }
  return shuffleArray([correctWord, ...wrong]);
}

export default function QuizPage() {
  const { addQuizScore } = useApp();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [direction, setDirection] = useState('en-vi');
  const [mode, setMode] = useState('select'); // 'select' | 'config' | 'quiz' | 'done'
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive || answered || timeLeft <= 0) return;
    const t = setTimeout(() => {
      if (timeLeft === 1) {
        setAnswered(true);
        setTimerActive(false);
        setSelected(null);
      } else {
        setTimeLeft(v => v - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, answered]);

  const startQuiz = () => {
    const words = selectedTopic === 'all'
      ? Object.entries(vocabulary).flatMap(([tid, ws]) => ws.map(w => ({ ...w, topicId: tid })))
      : (vocabulary[selectedTopic] || []).map(w => ({ ...w, topicId: selectedTopic }));

    if (words.length < 4) return;

    const shuffled = shuffleArray(words);
    const count = Math.min(numQuestions, words.length);
    const qs = shuffled.slice(0, count).map(word => ({
      word,
      options: generateOptions(word, words),
    }));
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(15);
    setTimerActive(true);
    setMode('quiz');
  };

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    setTimerActive(false);
    if (option.id === questions[currentQ].word.id) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      addQuizScore(score, questions.length, selectedTopic);
      setMode('done');
      setTimerActive(false);
    }
  };

  const topicData = topics.find(t => t.id === selectedTopic);
  const topicLabel = selectedTopic === 'all'
    ? '🎲 Trộn tất cả'
    : `${topicData?.icon || ''} ${topicData?.name || ''}`;

  // ---- TOPIC SELECT ----
  if (mode === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🎯 Quiz</h1>
          <p className="page-subtitle">Kiểm tra từ vựng bạn đã học</p>
        </div>

        <div className="topic-grid">
          <div key="all" className="topic-card" style={{ '--topic-gradient': 'var(--gradient-hero)' }} onClick={() => { setSelectedTopic('all'); setMode('config'); }}>
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
              onClick={() => { setSelectedTopic(topic.id); setMode('config'); }}
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

  // ---- CONFIG ----
  if (mode === 'config') {
    const wordCount = selectedTopic === 'all'
      ? Object.values(vocabulary).reduce((a, b) => a + b.length, 0)
      : (vocabulary[selectedTopic] || []).length;

    return (
      <div className="fade-in">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }} onClick={() => setMode('select')}>← Chọn chủ đề</button>
          <h1 className="page-title">⚙️ Cấu hình Quiz</h1>
          <p className="page-subtitle">{topicLabel} • {wordCount} từ có sẵn</p>
        </div>

        <div className="card" style={{ maxWidth: '520px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Số câu hỏi</h2>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '24px' }}>
            {[5, 10, 15, 20].map(n => (
              <button
                key={n}
                className={`btn ${numQuestions === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setNumQuestions(Math.min(n, wordCount))}
              >
                {n} câu
              </button>
            ))}
          </div>

          <h2 className="section-title" style={{ marginBottom: '16px' }}>Hướng câu hỏi</h2>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '24px' }}>
            <button className={`btn ${direction === 'en-vi' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDirection('en-vi')}>
              🇬🇧 → 🇻🇳 (Từ Anh, chọn nghĩa Việt)
            </button>
            <button className={`btn ${direction === 'vi-en' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDirection('vi-en')}>
              🇻🇳 → 🇬🇧 (Nghĩa Việt, chọn từ Anh)
            </button>
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={startQuiz}>
            🚀 Bắt đầu quiz {numQuestions} câu
          </button>
        </div>
      </div>
    );
  }

  // ---- DONE ----
  if (mode === 'done') {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📖';
    const msg = pct >= 90 ? 'Xuất sắc!' : pct >= 70 ? 'Rất tốt!' : pct >= 50 ? 'Khá ổn!' : 'Cần ôn thêm!';
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{emoji}</div>
        <h2 className="completion-title">{msg}</h2>
        <p className="text-secondary">Chủ đề: <strong style={{ color: 'var(--text-primary)' }}>{topicLabel}</strong></p>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{score}/{questions.length}</div>
            <div className="completion-stat-label">Đúng</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{pct}%</div>
            <div className="completion-stat-label">Điểm số</div>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="progress-bar-container" style={{ height: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={startQuiz}>🔄 Làm lại</button>
          <button className="btn btn-primary" onClick={() => setMode('select')}>🎯 Quiz khác</button>
        </div>
      </div>
    );
  }

  // ---- QUIZ ----
  const q = questions[currentQ];
  if (!q) return null;

  const timerPct = (timeLeft / 15) * 100;
  const timerColor = timeLeft > 8 ? 'var(--accent-green)' : timeLeft > 4 ? 'var(--accent-yellow)' : 'var(--accent-red)';
  const isEnVi = direction === 'en-vi';

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setMode('select')}>← Thoát</button>
        <div className="badge badge-purple">{topicLabel}</div>
        <div style={{ marginLeft: 'auto' }} className="badge badge-yellow">{score} điểm</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Câu {currentQ + 1}/{questions.length}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: timerColor }}>⏱ {timeLeft}s</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="progress-bar-container" style={{ marginTop: '6px', height: '4px' }}>
          <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: 'var(--radius-full)', transition: 'width 1s linear, background 0.3s ease' }} />
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: '24px', padding: '32px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {isEnVi ? 'Nghĩa tiếng Việt của từ này là gì?' : 'Từ tiếng Anh nào có nghĩa này?'}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          fontWeight: '800',
          background: 'var(--gradient-hero)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {isEnVi ? q.word.word : q.word.meaning}
        </div>
        {isEnVi && (
          <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '8px' }}>
            {q.word.pronunciation}
          </div>
        )}
      </div>

      <div className="quiz-options">
        {q.options.map((option, idx) => {
          let cls = 'quiz-option';
          const correctId = q.word.id;
          const shownText = isEnVi ? option.meaning : option.word;
          if (answered) {
            cls += ' disabled';
            if (option.id === correctId) cls += ' correct';
            else if (selected?.id === option.id) cls += ' wrong';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(option)}>
              {answered && option.id === correctId && '✅ '}
              {answered && selected?.id === option.id && option.id !== correctId && '❌ '}
              {shownText}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '24px', gap: '16px' }}>
          <div className="card" style={{ padding: '16px 24px', textAlign: 'center' }}>
            {selected?.id === q.word.id ? (
              <p style={{ color: 'var(--accent-green)', fontWeight: '600' }}>
                ✅ Chính xác! <span className="text-secondary">{q.word.example}</span>
              </p>
            ) : !selected ? (
              <p style={{ color: 'var(--accent-red)', fontWeight: '600' }}>
                ⏰ Hết giờ! Đáp án: <span style={{ color: 'var(--accent-green)' }}>{isEnVi ? q.word.meaning : q.word.word}</span>
              </p>
            ) : (
              <p style={{ color: 'var(--accent-red)', fontWeight: '600' }}>
                ❌ Sai rồi! Đáp án đúng: <span style={{ color: 'var(--accent-green)' }}>{isEnVi ? q.word.meaning : q.word.word}</span>
              </p>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQ < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}