import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import TopicSelector from '../components/TopicSelector';
import { pickRandom, buildChoiceOptions } from '../lib/gameUtils';
import { speak } from '../lib/speech';

const COUNT_OPTIONS = [5, 10, 15];
const LIVES = 3;
const NEXT_DELAY = 1300;

export default function ListeningChallengePage() {
  const { vocabulary, topics, isJapanese } = useLanguage();
  const { markKnown, addQuizScore } = useApp();
  const [phase, setPhase] = useState('select'); // 'select' | 'play' | 'done'
  const [count, setCount] = useState(10);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const current = queue[index] || null;

  const start = (topicId) => {
    const words = pickRandom(vocabulary[topicId] || [], count).map(w => ({ ...w, topicId }));
    if (words.length < 4) return;
    setQueue(words);
    setIndex(0);
    setScore(0);
    setLives(LIVES);
    setResult(null);
    setPhase('play');
    setOptions(buildChoiceOptions(words[0], words, 4));
    setPicked(null);
    setAnswered(false);
    speak(words[0].word, 0.8);
  };

  // Tự phát lại câu hỏi khi sang câu mới (chỉ khi đổi câu)
  useEffect(() => {
    if (phase !== 'play' || answered || !current) return;
    speak(current.word, 0.8);
  }, [phase, index, answered, current]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const finish = (finalScore, answeredCount, finalLives, outOfLives) => {
    if (answeredCount > 0) addQuizScore(finalScore, answeredCount, 'game:listening-challenge');
    setResult({ score: finalScore, total: Math.max(1, answeredCount), lives: finalLives, outOfLives });
    setPhase('done');
  };

  const pick = (option) => {
    if (answered || !current) return;
    setPicked(option);
    setAnswered(true);
    const correct = option.id === current.id;
    let nextScore = score;
    let nextLives = lives;
    if (correct) {
      nextScore += 1;
      setScore(nextScore);
      markKnown(current.topicId, current.id, { silent: true });
    } else {
      nextLives -= 1;
      setLives(nextLives);
    }

    timerRef.current = setTimeout(() => {
      const answeredCount = index + 1;
      if (nextLives <= 0) {
        finish(nextScore, answeredCount, Math.max(0, nextLives), true);
        return;
      }
      if (index < queue.length - 1) {
        setIndex(i => i + 1);
        const q = queue[index + 1];
        setOptions(buildChoiceOptions(q, queue, 4));
        setPicked(null);
        setAnswered(false);
        speak(q.word, 0.8);
      } else {
        finish(nextScore, answeredCount, nextLives, false);
      }
    }, NEXT_DELAY);
  };

  // ---- CHỌN CHỦ ĐỀ ----
  if (phase === 'select') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <Link to="/games" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }}>← Game khác</Link>
          <h1 className="page-title">🎧 Thử thách nghe</h1>
          <p className="page-subtitle">Nghe phát âm và chọn đúng nghĩa — 3 mạng cho mỗi ván</p>
        </div>

        <div className="card" style={{ marginBottom: '20px', maxWidth: '520px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Số câu mỗi ván</h2>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {COUNT_OPTIONS.map(n => (
              <button
                key={n}
                className={`btn ${count === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCount(n)}
              >
                {n} câu
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
        <div className="completion-emoji">{result.outOfLives ? '😵' : pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">
          {result.outOfLives ? 'Hết mạng rồi!' : pct >= 80 ? 'Tai thính lắm!' : pct >= 60 ? 'Khá ổn!' : 'Nghe thêm nhé!'}
        </h2>
        <p className="text-secondary">
          {result.outOfLives ? 'Bạn đã dùng hết 3 mạng — thử lại nào!' : 'Hoàn thành ván chơi'}
        </p>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{result.score}</div>
            <div className="completion-stat-label">Nghe đúng ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>{pct}%</div>
            <div className="completion-stat-label">Điểm</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{result.lives}</div>
            <div className="completion-stat-label">Mạng còn lại</div>
          </div>
        </div>
        <div className="flex gap-md">
          <button className="btn btn-secondary" onClick={() => start(queue[0].topicId)}>🔄 Chơi lại</button>
          <button className="btn btn-primary" onClick={() => setPhase('select')}>🎧 Chủ đề khác</button>
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
        <div style={{ marginLeft: 'auto' }} className="badge badge-yellow">✅ {score}</div>
        <div className="badge badge-red">
          {'❤️'.repeat(Math.max(0, lives))}{'🤍'.repeat(Math.max(0, LIVES - lives))}
        </div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>

      <div className="card lc-speaker">
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Câu {index + 1}/{queue.length} — Nghe và chọn nghĩa đúng
        </div>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button
            className="control-btn speak-btn"
            style={{ width: 72, height: 72, fontSize: '1.8rem' }}
            onClick={() => speak(current.word, 0.8)}
            title="Nghe lại"
          >
            🔊
          </button>
          <button
            className="control-btn"
            style={{ width: 72, height: 72, fontSize: '1.8rem' }}
            onClick={() => speak(current.word, 0.5)}
            title="Nghe chậm"
          >
            🐢
          </button>
        </div>
        {!isJapanese && (
          <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '10px' }}>
            Nhấn 🔊 nghe lại bao nhiêu lần cũng được
          </div>
        )}
      </div>

      <div className="quiz-options">
        {options.map((option) => {
          let cls = 'quiz-option';
          if (answered) {
            cls += ' disabled';
            if (option.id === current.id) cls += ' correct';
            else if (picked?.id === option.id) cls += ' wrong';
          }
          return (
            <button key={option.id} className={cls} onClick={() => pick(option)}>
              {answered && option.id === current.id && '✅ '}
              {answered && picked?.id === option.id && option.id !== current.id && '❌ '}
              {option.meaning}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="fade-in" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontWeight: '600', color: picked?.id === current.id ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {picked?.id === current.id
              ? `✅ Chính xác! ${current.word} — ${current.meaning}`
              : `❌ Đáp án: ${current.word} — ${current.meaning}`}
          </p>
        </div>
      )}
    </div>
  );
}
