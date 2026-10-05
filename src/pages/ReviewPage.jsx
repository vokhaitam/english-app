import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { splitWordKey } from '../lib/wordKey';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';

export default function ReviewPage() {
  const { vocabulary, topics } = useLanguage();
  const { getDueReviews, reviewCard, isStarred, toggleStar } = useApp();
  const [queueIdx, setQueueIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mode, setMode] = useState('review');
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);

  const queue = useMemo(() => getDueReviews(), [getDueReviews]);

  const current = queue[queueIdx] || null;

  const wordData = useMemo(() => {
    if (!current) return null;
    const parsed = splitWordKey(current.key);
    if (!parsed) return null;
    const topicWords = vocabulary[parsed.topicId] || [];
    const word = topicWords.find(w => w.id === parsed.wordId);
    const topic = topics.find(t => t.id === parsed.topicId);
    return word && topic ? { word, topic, topicId: parsed.topicId, wordId: parsed.wordId, wordKey: current.key } : null;
  }, [current, vocabulary, topics]);

  const advance = (known) => {
    if (known) setKnownCount(k => k + 1);
    else setDontKnowCount(k => k + 1);
    if (queueIdx + 1 >= queue.length) setCompleted(true);
    else setQueueIdx(i => i + 1);
  };

  if (mode === 'review' && queue.length === 0 && !completed) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🔁 Ôn tập</h1>
          <p className="page-subtitle">Ôn lại các từ bạn chưa nhớ</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <div className="empty-title">Không có từ nào cần ôn</div>
          <div className="empty-description">Hãy học thêm từ mới hoặc quay lại sau!</div>
        </div>
      </div>
    );
  }

  if (completed) {
    const total = knownCount + dontKnowCount;
    const acc = total > 0 ? Math.round((knownCount / total) * 100) : 0;
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">{acc >= 80 ? '🏆' : acc >= 60 ? '👏' : '💪'}</div>
        <h2 className="completion-title">{acc >= 80 ? 'Xuất sắc!' : acc >= 60 ? 'Tốt lắm!' : 'Cố gắng hơn!'}</h2>
        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>{knownCount}</div>
            <div className="completion-stat-label">Nhớ ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>{dontKnowCount}</div>
            <div className="completion-stat-label">Quên ❌</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{acc}%</div>
            <div className="completion-stat-label">Đúng</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setMode('review'); setQueueIdx(0); setKnownCount(0); setDontKnowCount(0); setCompleted(false); }}>
          🔄 Ôn lại
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex items-center gap-md" style={{ marginBottom: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setMode('review')}>← Về đầu</button>
          <span className="badge badge-purple">Còn {queue.length - queueIdx} từ</span>
        </div>
        <h1 className="page-title">🔁 Ôn tập</h1>
      </div>

      {wordData && (
        <FlashCard
          word={wordData.word}
          cardIndex={queueIdx}
          total={queue.length}
          onKnow={() => { reviewCard(wordData.topicId, wordData.wordId, true); advance(true); }}
          onDontKnow={() => { reviewCard(wordData.topicId, wordData.wordId, false); advance(false); }}
          onNext={() => advance(false)}
          onPrev={() => setQueueIdx(i => Math.max(0, i - 1))}
          isStarred={isStarred(wordData.wordKey)}
          onToggleStar={() => toggleStar(wordData.wordKey)}
        />
      )}
    </div>
  );
}
