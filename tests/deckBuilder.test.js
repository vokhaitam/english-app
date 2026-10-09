import { describe, it, expect } from 'vitest';
import {
  DECK_THEMES, getDeckTheme, deckItemKey, parseDeckItem,
  resolveDeckItems, suggestWords, searchAllWords,
} from '../src/lib/deckBuilder';
import { vocabulary, getAllWords } from '../src/data/vocabulary';

describe('deck themes', () => {
  it('has 8 themes with unique ids', () => {
    expect(DECK_THEMES.length).toBe(8);
    const ids = DECK_THEMES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every theme references real topics and has keywords', () => {
    const topicIds = new Set(Object.keys(vocabulary));
    for (const t of DECK_THEMES) {
      expect(t.topics.length, t.id).toBeGreaterThan(0);
      expect(t.keywords.length, t.id).toBeGreaterThan(0);
      for (const id of t.topics) {
        expect(topicIds.has(id), `${t.id} references unknown topic ${id}`).toBe(true);
      }
    }
  });

  it('getDeckTheme finds by id and returns null otherwise', () => {
    expect(getDeckTheme('travel')?.name).toContain('Du lịch');
    expect(getDeckTheme('nope')).toBeNull();
  });
});

describe('deck item keys', () => {
  it('round-trips topicId and wordId', () => {
    const key = deckItemKey('greetings', 42);
    expect(key).toBe('greetings#42');
    expect(parseDeckItem(key)).toEqual({ topicId: 'greetings', wordId: 42 });
  });

  it('returns null for malformed keys', () => {
    expect(parseDeckItem('no-separator')).toBeNull();
    expect(parseDeckItem('topic#abc')).toBeNull();
    expect(parseDeckItem('')).toBeNull();
  });
});

describe('resolveDeckItems', () => {
  const vocab = {
    greetings: [{ id: 1, word: 'hello', meaning: 'xin chào' }, { id: 2, word: 'hi', meaning: 'chào' }],
  };

  it('resolves items to words with topicId attached', () => {
    const out = resolveDeckItems(['greetings#1', 'greetings#2'], vocab);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ id: 1, word: 'hello', topicId: 'greetings' });
  });

  it('skips unknown words, bad keys and missing topics', () => {
    const out = resolveDeckItems(['greetings#99', 'bad-key', 'missing#1', 'greetings#2'], vocab);
    expect(out.map(w => w.id)).toEqual([2]);
  });

  it('returns an empty list for no input', () => {
    expect(resolveDeckItems([], vocab)).toEqual([]);
    expect(resolveDeckItems(undefined, vocab)).toEqual([]);
  });
});

describe('suggestWords', () => {
  const allWords = getAllWords();

  it('returns an empty list when there is no theme and no query', () => {
    expect(suggestWords(allWords, {})).toEqual([]);
  });

  it('ranks words matching the query first', () => {
    const out = suggestWords(allWords, { query: 'interview', limit: 10 });
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].word.toLowerCase()).toContain('interview');
  });

  it('limits results', () => {
    const out = suggestWords(allWords, { themeId: 'travel', limit: 5 });
    expect(out.length).toBeLessThanOrEqual(5);
    expect(out.length).toBeGreaterThan(0);
  });

  it('theme results carry a valid topicId', () => {
    const out = suggestWords(allWords, { themeId: 'school', limit: 8 });
    for (const w of out) {
      expect(vocabulary[w.topicId]).toBeDefined();
    }
  });
});

describe('searchAllWords', () => {
  const allWords = getAllWords();

  it('returns nothing for an empty query', () => {
    expect(searchAllWords(allWords, '')).toEqual([]);
    expect(searchAllWords(allWords, '   ')).toEqual([]);
  });

  it('matches by word and by meaning', () => {
    const byWord = searchAllWords(allWords, 'hello');
    expect(byWord.some(w => w.word.toLowerCase().includes('hello'))).toBe(true);

    const target = allWords[0];
    const byMeaning = searchAllWords(allWords, target.meaning.slice(0, 6));
    expect(byMeaning.length).toBeGreaterThan(0);
  });

  it('respects the limit', () => {
    expect(searchAllWords(allWords, 'a', 3).length).toBeLessThanOrEqual(3);
  });
});
