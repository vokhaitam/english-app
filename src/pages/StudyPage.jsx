import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import TopicSelector from '../components/TopicSelector';
import { wordKey as makeWordKey } from '../lib/wordKey';
import { resolveDeckItems } from '../lib/deckBuilder';

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
  const { markKnown, markUnknown, isStarred, toggleStar, customDecks, starredWords } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get('level');
  const topicParam = searchParams.get('topic');
  const wordParam = searchParams.get('w');
  const deckParam = searchParams.get('deck');
  const starredParam = searchParams.get('starred') === '1';
  const deck = deckParam ? customDecks[deckParam] || null : null;
  const inDeck = !!deck;
  const deckWords = useMemo(
    () => (deck ? resolveDeckItems(deck.items, vocabulary) : []),
    [deck, vocabulary],
  );
  const selectedTopic = topicParam && vocabulary[topicParam] ? topicParam : null;
  const [cardIndex, setCardIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [prevKey, setPrevKey] = useState(`${selectedTopic ?? ''}|${wordParam ?? ''}|${deckParam ?? ''}|${starredParam ? '1' : ''}`);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset per-topic state when the URL topic/word/deck/starred changes (derived state pattern)
  const key = `${selectedTopic ?? ''}|${wordParam ?? ''}|${deckParam ?? ''}|${starredParam ? '1' : ''}`;
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
  const inStarred = starredParam && !inDeck;
  const starredList = useMemo(
    () => allWords.filter(w => starredWords[makeWordKey(lang, w.topicId, w.id)]),
    [allWords, starredWords, lang],
  );
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return allWords
      .filter(w => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q))
      .slice(0, 20);
  }, [searchQuery, allWords]);

  const words = inStarred ? starredList : inDeck ? deckWords : selectedTopic ? vocabulary[selectedTopic] : [];
  const currentWord = words[cardIndex] || null;
  const currentTopicId = (inDeck || inStarred) ? currentWord?.topicId || null : selectedTopic;

  const levelTopics = level ? topics.filter(t => t.level === level) : [];
  const activeLevel = levels.find(l => l.id === level);

  const selectLevel = (levelId) => setSearchParams({ level: levelId });
  const selectTopic = (topicId) =>
    setSearchParams(level ? { level, topic: topicId } : { topic: topicId });
  const backToLevels = () => setSearchParams({});
  const backToTopics = () => setSearchParams(level ? { level } : {});

  const handleKnow = () => {
    if (currentWord && currentTopicId) markKnown(currentTopicId, currentWord.id);
    setKnownCount(k => k + 1);
    goNext();
  };

  const handleDontKnow = () => {
    if (currentWord && currentTopicId) markUnknown(currentTopicId, currentWord.id);
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

  const starKey = currentWord && currentTopicId ? makeWordKey(lang, currentTopicId, currentWord.id) : '';
  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  // ---- DECK NOT FOUND ----
  if (deckParam && !deck) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🗂️ Không tìm thấy bộ từ</h1>
          <p className="page-subtitle">Bộ từ này có thể đã bị xóa</p>
        </div>
        <div className="flex gap-md">
          <Link to="/my-decks" className="btn btn-primary">← Về bộ từ của tôi</Link>
          <Link to="/study" className="btn btn-secondary">📚 Học theo chủ đề</Link>
        </div>
      </div>
    );
  }

  // ---- LEVEL SELECT SCREEN ----
  if (!selectedTopic && !level && !inDeck && !inStarred) {
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
              <div
                className="topic-card"
                style={{ '--topic-gradient': 'linear-gradient(135deg, #f5a623, #ffce73)' }}
                onClick={() => setSearchParams({ starred: '1' })}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(135deg, #f5a623, #ffce73)',
                  borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                }} />
                <div className="topic-icon">⭐</div>
                <div className="topic-name">Đã đánh dấu</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Ôn lại những từ bạn đã lưu yêu thích
                </div>
                <div className="topic-count">
                  {starredList.length} từ
                </div>
              </div>
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
  if ((!selectedTopic) && level && !inDeck && !inStarred) {
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
          Bạn đã hoàn thành {inDeck ? 'bộ từ' : inStarred ? 'danh sách' : 'chủ đề'}{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {inDeck ? deck.name : inStarred ? '⭐ Từ đã đánh dấu' : selectedTopicData?.name}
          </strong>
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
          {inDeck ? (
            <Link to="/my-decks" className="btn btn-primary">
              🗂️ Bộ từ của tôi
            </Link>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsCompleted(false);
                backToTopics();
              }}
            >
              📚 Chủ đề khác
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- STUDY SCREEN ----
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        {inDeck ? (
          <Link to="/my-decks" className="btn btn-ghost btn-sm">
            ← Bộ từ của tôi
          </Link>
        ) : inStarred ? (
          <Link to="/study" className="btn btn-ghost btn-sm">
            ← Học từ vựng
          </Link>
        ) : (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              backToTopics();
            }}
          >
            ← Chọn chủ đề
          </button>
        )}
        <div className="badge badge-purple">
          {inDeck
            ? `${deck.icon} ${deck.name}`
            : inStarred
              ? '⭐ Từ đã đánh dấu'
              : `${selectedTopicData?.icon} ${selectedTopicData?.name}`}
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
          isStarred={isStarred(starKey)}
          onToggleStar={() => toggleStar(starKey)}
        />
      )}
      {words.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem' }}>{inStarred ? '⭐' : '🗂️'}</div>
          <h3>{inStarred ? 'Chưa có từ nào được đánh dấu' : 'Bộ từ trống'}</h3>
          <p className="text-secondary">
            {inStarred
              ? 'Bấm ngôi sao trên thẻ khi học để lưu từ vào đây nhé.'
              : 'Bộ từ này chưa có từ vựng nào để học.'}
          </p>
          <Link to="/study" className="btn btn-primary">📚 Học từ vựng</Link>
        </div>
      )}
    </div>
  );
}