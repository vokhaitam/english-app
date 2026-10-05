import React, { useState } from 'react';
import { speak } from '../lib/speech';

export default function FlashCard({ word, onKnow, onDontKnow, onNext, onPrev, isStarred, onToggleStar, cardIndex, total }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [prevWord, setPrevWord] = useState(word);

  // Reset flip/card state when the card changes (derived state pattern)
  if (word !== prevWord) {
    setPrevWord(word);
    setIsFlipped(false);
    setIsAnimating(false);
  }

  const handleFlip = () => {
    setIsFlipped(f => !f);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(word.word, 0.85);
  };

  const reading = word.reading && word.reading !== word.word ? word.reading : '';
  const pronunciation = word.pronunciation || word.romaji || '';

  const handleKnow = (e) => {
    e.stopPropagation();
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onKnow();
    }, 260);
  };

  const handleDontKnow = (e) => {
    e.stopPropagation();
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onDontKnow();
    }, 260);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection('prev');
    onPrev();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setDirection('next');
    onNext();
  };

  return (
    <div className="fade-in">
      {/* Progress */}
      <div style={{ marginBottom: '20px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
            Thẻ {cardIndex + 1} / {total}
          </span>
          <span className="badge badge-purple">
            {Math.round(((cardIndex + 1) / total) * 100)}%
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${((cardIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flashcard-card-3d">
        <div
          key={`${direction}-${word.id}`}
          className={`flashcard-scene ${direction === 'prev' ? 'flashcard-enter-left' : 'flashcard-enter-right'}`}
        >
          <div
            className="flashcard-shift"
            style={{
              opacity: isAnimating ? 0.4 : 1,
              transition: 'opacity 0.25s ease',
              transform: isAnimating ? (direction === 'next' ? 'translateX(-40px)' : 'translateX(40px)') : 'none',
            }}
          >
            <div
              className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
              style={{ minHeight: '260px' }}
            >
              {/* Front */}
              <div className="flashcard-face flashcard-front">
                <span className="card-hint">Nhấn để xem nghĩa 👆</span>
                {word.type && (
                  <span className="card-type-badge">
                    <span className="badge badge-purple">{word.type}</span>
                  </span>
                )}
                <div className="flashcard-clip">
                  <div className="card-word">{word.word}</div>
                  {reading && <div className="card-reading">{reading}</div>}
                  {pronunciation && <div className="card-pronunciation">{pronunciation}</div>}
                </div>
              </div>

              {/* Back */}
              <div className="flashcard-face flashcard-back">
                <span className="card-hint">✅ Nghĩa của từ</span>
                <div className="flashcard-clip">
                  <div className="card-meaning">{word.meaning}</div>
                  <div className="card-example">"{word.example}"</div>
                  {word.exampleMeaning && (
                    <div className="card-example-meaning">{word.exampleMeaning}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flashcard-controls" style={{ marginTop: '24px' }}>
        <button
          className="control-btn dont-know"
          onClick={handleDontKnow}
          title="Chưa biết"
        >
          ❌
        </button>

        <button
          className="control-btn"
          onClick={handlePrev}
          title="Thẻ trước"
        >
          ◀
        </button>

        <button
          className="control-btn speak-btn"
          onClick={handleSpeak}
          title="Phát âm"
        >
          🔊
        </button>

        <button
          className={`control-btn star-btn ${isStarred ? 'starred' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
          title={isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        >
          {isStarred ? '⭐' : '☆'}
        </button>

        <button
          className="control-btn"
          onClick={handleNext}
          title="Thẻ tiếp"
        >
          ▶
        </button>

        <button
          className="control-btn know"
          onClick={handleKnow}
          title="Đã biết"
        >
          ✅
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-md" style={{ marginTop: '16px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ❌ Chưa biết
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ✅ Đã biết
        </span>
      </div>
    </div>
  );
}
