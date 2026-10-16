import React, { useState, useEffect, useRef } from 'react';
import { speak } from '../lib/speech';

export default function FlashCard({ word, onKnow, onDontKnow, onNext, onPrev, isStarred, onToggleStar, cardIndex, total }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevWordRef = useRef(word);

  // Reset flip state when card changes
  useEffect(() => {
    if (word !== prevWordRef.current) {
      prevWordRef.current = word;
      setIsFlipped(false);
    }
  }, [word]);

  const handleFlip = () => {
    if (!isTransitioning) setIsFlipped(f => !f);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(word.word, 0.85);
  };

  const reading = word.reading && word.reading !== word.word ? word.reading : '';
  const pronunciation = word.pronunciation || word.romaji || '';

  const animateAndAct = (callback, dir = 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(dir);
    setAnimKey(k => k + 1);
    
    // Animation duration: 350ms
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 320);
  };

  const handleKnow = (e) => {
    e.stopPropagation();
    animateAndAct(onKnow, 'next');
  };

  const handleDontKnow = (e) => {
    e.stopPropagation();
    animateAndAct(onDontKnow, 'next');
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('prev');
    setAnimKey(k => k + 1);
    setTimeout(() => {
      onPrev();
      setIsTransitioning(false);
    }, 350);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('next');
    setAnimKey(k => k + 1);
    setTimeout(() => {
      onNext();
      setIsTransitioning(false);
    }, 350);
  };

  const progressPercent = ((cardIndex + 1) / total) * 100;

  return (
    <div className="flashcard-container">
      {/* Progress */}
      <div className="flashcard-progress">
        <div className="flashcard-progress-info">
          <span className="flashcard-progress-label">Thẻ {cardIndex + 1} / {total}</span>
          <span className="flashcard-progress-percent">{Math.round(progressPercent)}%</span>
        </div>
        <div className="flashcard-progress-bar">
          <div 
            className="flashcard-progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card with animation */}
      <div className="flashcard-card-3d">
        <div
          key={animKey}
          className={`flashcard-scene ${direction === 'prev' ? 'slide-from-left' : 'slide-from-right'} ${isTransitioning ? 'is-animating' : ''}`}
        >
          <div
            className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="flashcard-face flashcard-front">
              <span className="card-hint">👆 Nhấn để xem nghĩa</span>
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
              <div className="card-flip-hint">
                <span>Lật thẻ</span>
              </div>
            </div>

            {/* Back */}
            <div className="flashcard-face flashcard-back">
              <span className="card-hint">✅ Nghĩa của từ</span>
              <div className="flashcard-clip">
                <div className="card-meaning">{word.meaning}</div>
                {word.example && (
                  <div className="card-example">"{word.example}"</div>
                )}
                {word.exampleMeaning && (
                  <div className="card-example-meaning">{word.exampleMeaning}</div>
                )}
              </div>
              <div className="card-flip-hint">
                <span>Lật lại</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flashcard-controls">
        <button
          className="control-btn dont-know"
          onClick={handleDontKnow}
          title="Chưa biết"
        >
          <span className="control-btn-icon">❌</span>
          <span className="control-btn-label">Chưa biết</span>
        </button>

        <button
          className="control-btn nav-btn"
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
          className="control-btn nav-btn"
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
          <span className="control-btn-icon">✅</span>
          <span className="control-btn-label">Đã biết</span>
        </button>
      </div>

      {/* Legend */}
      <div className="flashcard-legend">
        <span>❌ Chưa biết</span>
        <span className="flashcard-legend-dot">•</span>
        <span>✅ Đã biết</span>
      </div>
    </div>
  );
}
