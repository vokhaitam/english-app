import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import TopicSelector from '../components/TopicSelector';

const TYPE_LABELS = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  number: 'Số thứ tự',
  phrase: 'Cụm từ',
  preposition: 'Giới từ',
};

export default function StudyPage() {
  const { vocabulary, topics, levels, getAllWords, lang } = useLanguage();
  const { markKnown, markUnknown, isStarred, toggleStar, knownWords } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get('level');
  const topicParam = searchParams.get('topic');
  const wordParam = searchParams.get('w');
  const selectedTopic = topicParam && vocabulary[topicParam] ? topicParam : null;
  const [cardIndex, setCardIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [prevKey, setPrevKey] = useState(`${selectedTopic ?? ''}|${wordParam ?? ''}`);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset per-topic state when the URL topic/word changes (derived state pattern)
  const key = `${selectedTopic ?? ''}|${wordParam ?? ''}`;
  if (key !== prevKey) {
    setPrevKey(key);
    const words = selectedTopic ? vocabulary[selectedTopic] : [];
    const targetIndex = wordParam
      ? words.findIndex(wc => String(wc.id) === wordParam)
      : -1;
    setCardIndex(targetIndex >= 0 ? targetIndex : 0);
    setKnownCount(0);
    setDontKnowCount(0);
    setIsCompleted(false);
  }

  const allWords = useMemo(() => getAllWords(), [getAllWords]);
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return allWords
      .filter(w => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q))
      .slice(0, 20);
  }, [searchQuery, allWords]);

  const words = selectedTopic ? vocabulary[selectedTopic] : [];
  const currentWord = words[cardIndex] || null;

  const progress = Object.fromEntries(
    Object.entries(knownWords).map(([k, v]) => [k, { known: v.length }])
  );

  const levelTopics = level ? topics.filter(t => t.level === level) : [];
  const activeLevel = levels.find(l => l.id === level);

  const selectLevel = (levelId) => setSearchParams({ level: levelId });
  const selectTopic = (topicId) =>
    setSearchParams(level ? { level, topic: topicId } : { topic: topicId });
  const backToLevels = () => setSearchParams({});
  const backToTopics = () => setSearchParams(level ? { level } : {});

  const handleKnow = () => {
    if (currentWord) markKnown(selectedTopic, currentWord.id);
    setKnownCount(k => k + 1);
    goNext();
  };

  const handleDontKnow = () => {
    if (currentWord) markUnknown(selectedTopic, currentWord.id);
    setDontKnowCount(k => k + 1);
    goNext();
  };

  const goNext = () => {
    if (cardIndex < words.length - 1) {
      setCardIndex(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const goPrev = () => {
    if (cardIndex > 0) setCardIndex(i => i - 1);
  };

  const wordKey = currentWord ? `${selectedTopic}-${currentWord.id}` : '';
  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  // ---- LEVEL SELECT SCREEN ----
  if (!selectedTopic && !level) {
    const totalWords = topics.reduce((sum, t) => sum + (vocabulary[t.id]?.length || 0), 0);
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">📚 Học từ vựng</h1>
          <p className="page-subtitle">Chọn cấp độ từ vựng phù hợp với bạn</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm từ vựng (tiếng Anh hoặc tiếng Việt)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear"
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery.trim() ? (
            <div className="search-results fade-in">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '16px 0 12px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}>
                <span>
                  {searchResults.length === 0
                    ? `Không tìm thấy từ "${searchQuery}"`
                    : `Tìm thấy ${searchResults.length} từ khớp`}
                </span>
              </div>

              {searchResults.length > 0 && (
                <div className="search-results-list">
                  {searchResults.map((r, i) => {
                    const topicData = topics.find(t => t.id === r.topicId);
                    const levelData = levels.find(l => l.id === topicData?.level);
                    return (
                      <div
                        key={`${lang}:${r.topicId}-${r.id}`}
                        onClick={() => setSearchParams({ level: topicData?.level, topic: r.topicId, w: r.id })}
                        className="search-result-item"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <div className="search-result-main">
                          <div className="search-result-wordline">
                            <span className="search-result-word">{r.word}</span>
                            <span className="search-result-pron">{r.pronunciation}</span>
                          </div>
                          <span className="search-result-meaning">{r.meaning}</span>
                        </div>
                        <div className="search-result-side">
                          <span
                            className="search-result-type"
                            title={r.type}
                          >
                            {TYPE_LABELS[r.type] || r.type}
                          </span>
                          <span
                            className="search-result-topic"
                            style={{
                              background: `${levelData?.color || '#666'}22`,
                              color: levelData?.color || '#666',
                            }}
                          >
                            {topicData?.icon} {topicData?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {searchResults.length === 0 && (
                <div className="search-results-empty">
                  Thử từ khóa khác (tiếng Anh hoặc tiếng Việt) nhé
                </div>
              )}
            </div>
          ) : (
            <div className="topic-grid">
              {levels.map(lvl => {
                const lvlTopics = topics.filter(t => t.level === lvl.id);
                const lvlWords = lvlTopics.reduce((sum, t) => sum + (vocabulary[t.id]?.length || 0), 0);
                return (
                  <div
                    key={lvl.id}
                    className="topic-card"
                    style={{ '--topic-gradient': `linear-gradient(135deg, ${lvl.color}, ${lvl.color}cc)` }}
                    onClick={() => selectLevel(lvl.id)}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(135deg, ${lvl.color}, ${lvl.color}cc)`,
                      borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                    }} />
                    <div className="topic-icon">{lvl.icon}</div>
                    <div className="topic-name">{lvl.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {lvl.desc}
                    </div>
                    <div className="topic-count">
                      {lvlTopics.length} chủ đề • {lvlWords} từ vựng
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!searchQuery.trim() && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>
            Tổng cộng {topics.length} chủ đề • {totalWords} từ vựng
          </p>
        )}
      </div>
    );
  }

  // ---- TOPIC SELECT SCREEN (inside a level) ----
  if ((!selectedTopic) && level) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button className="btn btn-ghost btn-sm" onClick={backToLevels}>
              ← Tất cả cấp độ
            </button>
            <span className="badge" style={{ background: `${activeLevel?.color}22`, color: activeLevel?.color }}>
              {activeLevel?.icon} {activeLevel?.label}
            </span>
          </div>
          <h1 className="page-title">📚 {activeLevel?.label}</h1>
          <p className="page-subtitle">Chọn chủ đề bạn muốn học hôm nay</p>
        </div>

        <TopicSelector
          topics={levelTopics}
          onSelect={selectTopic}
          progress={progress}
        />
      </div>
    );
  }

  // ---- COMPLETION SCREEN ----
  if (isCompleted) {
    const accuracy = Math.round((knownCount / words.length) * 100);
    return (
      <div className="completion-screen fade-in">
        <div className="completion-emoji">
          {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👏' : '💪'}
        </div>
        <h2 className="completion-title">
          {accuracy >= 80 ? 'Xuất sắc!' : accuracy >= 60 ? 'Tốt lắm!' : 'Cố lên!'}
        </h2>
        <p className="text-secondary">
          Bạn đã hoàn thành chủ đề <strong style={{ color: 'var(--text-primary)' }}>{selectedTopicData?.name}</strong>
        </p>

        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>
              {knownCount}
            </div>
            <div className="completion-stat-label">Đã biết ✅</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>
              {dontKnowCount}
            </div>
            <div className="completion-stat-label">Chưa biết ❌</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>
              {accuracy}%
            </div>
            <div className="completion-stat-label">Chính xác</div>
          </div>
        </div>

        <div className="flex gap-md">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCardIndex(0);
              setKnownCount(0);
              setDontKnowCount(0);
              setIsCompleted(false);
            }}
          >
            🔄 Học lại
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsCompleted(false);
              backToTopics();
            }}
          >
            📚 Chủ đề khác
          </button>
        </div>
      </div>
    );
  }

  // ---- STUDY SCREEN ----
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            backToTopics();
          }}
        >
          ← Chọn chủ đề
        </button>
        <div className="badge badge-purple">
          {selectedTopicData?.icon} {selectedTopicData?.name}
        </div>
      </div>

      {currentWord && (
        <FlashCard
          word={currentWord}
          cardIndex={cardIndex}
          total={words.length}
          onKnow={handleKnow}
          onDontKnow={handleDontKnow}
          onNext={goNext}
          onPrev={goPrev}
          isStarred={isStarred(wordKey)}
          onToggleStar={() => toggleStar(wordKey)}
        />
      )}
    </div>
  );
}