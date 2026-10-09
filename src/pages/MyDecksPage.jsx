import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  DECK_THEMES, suggestWords, searchAllWords, deckItemKey, resolveDeckItems,
} from '../lib/deckBuilder';

const ICONS = ['🗂️', '💼', '✈️', '🍜', '📧', '🌍', '💬', '💪', '🎓', '🎯', '📚', '⭐'];

function WordRow({ word, right }) {
  const topic = word.topicId;
  return (
    <div className="word-row">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '700' }}>{word.word}</span>
          {word.pronunciation && (
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>{word.pronunciation}</span>
          )}
          {topic && <span className="badge" style={{ fontSize: '0.68rem' }}>{topic}</span>}
        </div>
        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{word.meaning}</div>
      </div>
      {right}
    </div>
  );
}

export default function MyDecksPage() {
  const { getAllWords, lang, vocabulary, pack } = useLanguage();
  const { customDecks, createDeck, updateDeck, deleteDeck, getDeckKnown } = useApp();

  const [mode, setMode] = useState('list'); // 'list' | 'builder'
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🗂️');
  const [themeId, setThemeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]); // ['topicId#wordId']

  const allWords = useMemo(() => getAllWords(), [getAllWords]);
  const wordMap = useMemo(() => {
    const m = new Map();
    for (const w of allWords) m.set(deckItemKey(w.topicId, w.id), w);
    return m;
  }, [allWords]);

  const deckList = Object.values(customDecks);
  const suggestions = useMemo(
    () => suggestWords(allWords, { themeId, limit: 40 }),
    [allWords, themeId],
  );
  const searchResults = useMemo(
    () => (themeId ? [] : searchAllWords(allWords, searchQuery, 20)),
    [allWords, searchQuery, themeId],
  );

  const selectedWords = items.map(k => wordMap.get(k)).filter(Boolean);

  const startCreate = () => {
    setEditingId(null);
    setName('');
    setIcon('🗂️');
    setThemeId(null);
    setSearchQuery('');
    setItems([]);
    setMode('builder');
  };

  const startEdit = (deck) => {
    setEditingId(deck.id);
    setName(deck.name);
    setIcon(deck.icon || '🗂️');
    setThemeId(deck.themeId || null);
    setSearchQuery('');
    setItems([...(deck.items || [])]);
    setMode('builder');
  };

  const toggleItem = (key) => {
    setItems(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  };

  const handleSave = () => {
    if (items.length === 0) return;
    const payload = {
      name: (name || '').trim() || 'Bộ từ mới',
      icon,
      items,
      themeId,
    };
    if (editingId) updateDeck(editingId, payload);
    else createDeck({ ...payload, lang });
    setMode('list');
  };

  const applyTheme = (id) => {
    setThemeId(id);
    setSearchQuery('');
    const theme = DECK_THEMES.find(t => t.id === id);
    if (theme && !name.trim() && !editingId) setName(theme.name);
  };

  const addFromList = (list) => {
    setItems(prev => {
      const next = [...prev];
      for (const w of list) {
        const k = deckItemKey(w.topicId, w.id);
        if (!next.includes(k)) next.push(k);
      }
      return next;
    });
  };

  // ---- BUILDER ----
  if (mode === 'builder') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }} onClick={() => setMode('list')}>
            ← Bộ từ của tôi
          </button>
          <h1 className="page-title">{editingId ? '✏️ Sửa bộ từ' : '✨ Tạo bộ từ mới'}</h1>
          <p className="page-subtitle">
            Chọn chủ đề để nhận gợi ý thông minh, hoặc tìm kiếm từ vựng thủ công
          </p>
        </div>

        {/* Tên + icon */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>Tên bộ từ</h2>
          <input
            type="text"
            className="search-input"
            placeholder="VD: Từ vựng phỏng vấn..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={40}
          />
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '14px' }}>
            {ICONS.map(ic => (
              <button
                key={ic}
                className={`btn btn-sm ${icon === ic ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIcon(ic)}
                style={{ fontSize: '1.1rem', padding: '6px 10px' }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Chủ đề gợi ý */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <h2 className="section-title">🤖 Gợi ý theo chủ đề</h2>
            {themeId && (
              <button className="btn btn-ghost btn-sm" onClick={() => setThemeId(null)}>
                Bỏ chọn
              </button>
            )}
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '16px' }}>
            {DECK_THEMES.map(t => (
              <button
                key={t.id}
                className={`btn btn-sm ${themeId === t.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyTheme(themeId === t.id ? null : t.id)}
                title={t.desc}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>

          {themeId && (
            <>
              <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  {suggestions.length} từ gợi ý
                </span>
                <button className="btn btn-secondary btn-sm" onClick={() => addFromList(suggestions)}>
                  ➕ Thêm tất cả gợi ý
                </button>
              </div>
              <div className="word-list">
                {suggestions.map(w => {
                  const k = deckItemKey(w.topicId, w.id);
                  const added = items.includes(k);
                  return (
                    <WordRow
                      key={k}
                      word={w}
                      right={
                        <button
                          className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => toggleItem(k)}
                        >
                          {added ? '✓ Đã thêm' : '➕ Thêm'}
                        </button>
                      }
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Tìm kiếm */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>🔍 Tìm từ vựng</h2>
          <input
            type="text"
            className="search-input"
            placeholder={pack?.searchPlaceholder || "Nhập từ vựng hoặc nghĩa tiếng Việt..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery.trim() && (
            <div className="word-list" style={{ marginTop: '12px' }}>
              {searchResults.length === 0 && (
                <div className="text-muted" style={{ fontSize: '0.85rem', padding: '8px 0' }}>
                  Không tìm thấy từ nào khớp
                </div>
              )}
              {searchResults.map(w => {
                const k = deckItemKey(w.topicId, w.id);
                const added = items.includes(k);
                return (
                  <WordRow
                    key={k}
                    word={w}
                    right={
                      <button
                        className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggleItem(k)}
                      >
                        {added ? '✓ Đã thêm' : '➕ Thêm'}
                      </button>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Đã chọn */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <h2 className="section-title">✅ Đã chọn ({items.length} từ)</h2>
            {items.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setItems([])}>
                Xóa hết
              </button>
            )}
          </div>
          {selectedWords.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Chưa có từ nào — hãy chọn từ chủ đề gợi ý hoặc tìm kiếm ở trên.
            </p>
          ) : (
            <div className="word-list">
              {selectedWords.map(w => {
                const k = deckItemKey(w.topicId, w.id);
                return (
                  <WordRow
                    key={k}
                    word={w}
                    right={
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleItem(k)}>
                        ✕ Bỏ
                      </button>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={items.length === 0}
          >
            💾 {editingId ? 'Lưu thay đổi' : `Tạo bộ từ (${items.length} từ)`}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => setMode('list')}>
            Hủy
          </button>
        </div>
      </div>
    );
  }

  // ---- LIST ----
  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">🗂️ Bộ từ của tôi</h1>
          <p className="page-subtitle">Tạo bộ từ cá nhân theo chủ đề bạn muốn, rồi học hoặc kiểm tra riêng</p>
        </div>
        <button className="btn btn-primary" onClick={startCreate}>✨ Tạo bộ từ mới</button>
      </div>

      {deckList.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem' }}>🗂️</div>
          <h3>Chưa có bộ từ nào</h3>
          <p className="text-secondary">
            Tạo bộ từ theo chủ đề (phỏng vấn, du lịch, IELTS...) — hệ thống sẽ gợi ý từ vựng phù hợp cho bạn.
          </p>
          <button className="btn btn-primary" onClick={startCreate}>✨ Tạo bộ từ đầu tiên</button>
        </div>
      ) : (
        <div className="deck-grid">
          {deckList.map(deck => {
            const total = (deck.items || []).length;
            const known = getDeckKnown(deck);
            const pct = total > 0 ? Math.round((known / total) * 100) : 0;
            const theme = deck.themeId ? DECK_THEMES.find(t => t.id === deck.themeId) : null;
            const deckWords = resolveDeckItems(deck.items, vocabulary);
            return (
              <div key={deck.id} className="card deck-card">
                <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span style={{ fontSize: '1.6rem' }}>{deck.icon || '🗂️'}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.05rem' }}>
                        {deck.name}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {theme ? `${theme.icon} ${theme.name}` : 'Bộ từ tự chọn'} • {total} từ
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${pct >= 100 ? 'badge-green' : 'badge-purple'}`}>{pct}%</span>
                </div>

                <div className="progress-bar-container" style={{ height: '8px', marginBottom: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '14px' }}>
                  {known}/{total} từ đã học
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to={`/study?deck=${deck.id}`}
                    className={`btn btn-sm ${total > 0 ? 'btn-primary' : 'btn-secondary'}`}
                    title={total === 0 ? 'Bộ từ trống' : 'Học flashcard'}
                  >
                    📚 Học
                  </Link>
                  <Link
                    to={`/quiz?deck=${deck.id}`}
                    className="btn btn-secondary btn-sm"
                    style={total < 4 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
                    title={total < 4 ? 'Quiz cần ít nhất 4 từ' : 'Làm quiz'}
                  >
                    🎯 Quiz
                  </Link>
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(deck)}>
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'rgba(223,59,79,0.4)', color: 'var(--accent-red)' }}
                    onClick={() => {
                      if (window.confirm(`Xóa bộ từ "${deck.name}"?`)) deleteDeck(deck.id);
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>

                {deckWords.length > 0 && (
                  <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '12px' }}>
                    {deckWords.slice(0, 4).map(w => w.word).join(' • ')}
                    {deckWords.length > 4 ? ` • +${deckWords.length - 4} nữa` : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="flex items-center gap-md">
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
            Mẹo: bộ từ cá nhân hoạt động song song với tiến trình theo chủ đề —
            học từ nào trong bộ thì tiến độ chủ đề đó cũng tăng theo.
            Từ đã đánh dấu ⭐ vẫn nằm ở{' '}
            <Link to="/study?starred=1" style={{ color: 'var(--accent-primary)' }}>trang Đã đánh dấu</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
