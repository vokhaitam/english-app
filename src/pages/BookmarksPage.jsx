import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { wordKey } from '../lib/wordKey';
import { useApp } from '../context/AppContext';
import { speak } from '../lib/speech';

export default function BookmarksPage() {
  const { vocabulary, topics, lang } = useLanguage();
  const { starredWords, toggleStar } = useApp();

  // Collect all starred words
  const allWords = Object.entries(vocabulary).flatMap(([topicId, words]) =>
    words.map(w => ({ ...w, topicId }))
  );

  const starred = allWords.filter(w => starredWords[wordKey(lang, w.topicId, w.id)]);

  const handleSpeak = (word) => {
    speak(word, 0.85);
  };

  if (starred.length === 0) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">⭐ Từ đã đánh dấu</h1>
          <p className="page-subtitle">Các từ bạn muốn ôn tập thêm</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <div className="empty-title">Chưa có từ nào được đánh dấu</div>
          <div className="empty-description">
            Khi học flashcard, nhấn ⭐ để lưu những từ bạn muốn ôn lại
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">⭐ Từ đã đánh dấu</h1>
        <p className="page-subtitle">{starred.length} từ cần ôn tập</p>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {starred.map(word => {
          const topic = topics.find(t => t.id === word.topicId);
          const key = wordKey(lang, word.topicId, word.id);
          return (
            <div key={key} className="card" style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-md" style={{ marginBottom: '6px' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      background: 'var(--gradient-hero)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {word.word}
                    </div>
                    <span className="badge badge-purple">{word.type}</span>
                    <span className="badge" style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                    }}>
                      {topic?.icon} {topic?.name}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '4px' }}>
                    {word.pronunciation}
                  </div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{word.meaning}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    "{word.example}"
                  </div>
                </div>
                <div className="flex flex-col gap-sm" style={{ marginLeft: '16px' }}>
                  <button
                    className="btn btn-icon"
                    style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: 'var(--accent-cyan)' }}
                    onClick={() => handleSpeak(word.word)}
                    title="Phát âm"
                  >
                    🔊
                  </button>
                  <button
                    className="btn btn-icon"
                    style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: 'var(--accent-yellow)' }}
                    onClick={() => toggleStar(key)}
                    title="Bỏ đánh dấu"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
