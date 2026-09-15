import { describe, it, expect } from 'vitest';
import { topics, levels, vocabulary, getAllWords } from '../src/data/vocabulary';
import { grammarLessons } from '../src/data/grammar';
import { grammarPractice } from '../src/data/practice';
import { dailySentences } from '../src/data/sentences';

const VALID_TYPES = new Set(['noun', 'verb', 'adjective', 'adverb', 'number', 'phrase', 'preposition']);

describe('vocabulary data', () => {
  it('has exactly 26 topics with 100 words each (2600 words)', () => {
    expect(topics.length).toBe(26);
    expect(Object.keys(vocabulary).length).toBe(26);
    const total = Object.values(vocabulary).reduce((sum, words) => sum + words.length, 0);
    expect(total).toBe(2600);
  });

  it('every topic has exactly 100 words', () => {
    for (const topic of topics) {
      expect(vocabulary[topic.id]?.length, `topic ${topic.id}`).toBe(100);
    }
  });

  it('each topic id appears in the topics list once', () => {
    const ids = topics.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every topic id in vocabulary has a corresponding topic entry and vice versa', () => {
    const topicIds = new Set(topics.map(t => t.id));
    const vocabIds = Object.keys(vocabulary);
    expect(vocabIds.every(id => topicIds.has(id))).toBe(true);
    for (const id of topicIds) {
      expect(vocabulary[id], `missing words for topic ${id}`).toBeDefined();
    }
  });

  it('all topics reference a valid level', () => {
    const levelIds = new Set(levels.map(l => l.id));
    for (const topic of topics) {
      expect(levelIds.has(topic.level), `topic ${topic.id} has bad level ${topic.level}`).toBe(true);
    }
  });

  it('word ids are unique and sequential within each topic', () => {
    for (const [topicId, words] of Object.entries(vocabulary)) {
      const ids = words.map(w => w.id);
      expect(new Set(ids).size, `topic ${topicId} has duplicate word ids`).toBe(ids.length);
      for (let i = 0; i < ids.length; i++) {
        expect(ids[i], `topic ${topicId}`).toBe(i + 1);
      }
    }
  });

  it('all words have required fields', () => {
    for (const [topicId, words] of Object.entries(vocabulary)) {
      for (const w of words) {
        expect(typeof w.word, `topic ${topicId} word#${w.id} missing word`).toBe('string');
        expect(w.word.length, `topic ${topicId} word#${w.id} empty word`).toBeGreaterThan(0);
        expect(typeof w.meaning, `topic ${topicId} word#${w.id} missing meaning`).toBe('string');
        expect(w.meaning.length, `topic ${topicId} word#${w.id} empty meaning`).toBeGreaterThan(0);
        expect(typeof w.pronunciation, `topic ${topicId} word#${w.id} missing pron`).toBe('string');
        expect(typeof w.example, `topic ${topicId} word#${w.id} missing example`).toBe('string');
        expect(typeof w.type, `topic ${topicId} word#${w.id} missing type`).toBe('string');
      }
    }
  });

  it('every word type is a valid value', () => {
    for (const [topicId, words] of Object.entries(vocabulary)) {
      for (const w of words) {
        expect(VALID_TYPES.has(w.type), `topic ${topicId} word#${w.id} bad type "${w.type}"`).toBe(true);
      }
    }
  });

  it('no duplicate word or meaning inside a single topic', () => {
    for (const [topicId, words] of Object.entries(vocabulary)) {
      const seenWord = new Set();
      const seenMeaning = new Set();
      for (const w of words) {
        const key = w.word.toLowerCase();
        expect(seenWord.has(key), `topic ${topicId}: duplicate word "${w.word}"`).toBe(false);
        seenWord.add(key);
        const m = w.meaning.toLowerCase();
        expect(seenMeaning.has(m), `topic ${topicId}: duplicate meaning "${w.meaning}"`).toBe(false);
        seenMeaning.add(m);
      }
    }
  });

  it('getAllWords returns every word with a topicId', () => {
    const all = getAllWords();
    expect(all.length).toBe(2600);
    for (const w of all) {
      expect(typeof w.topicId).toBe('string');
      expect(w.topicId.length).toBeGreaterThan(0);
    }
  });
});

describe('grammar data', () => {
  it('every lesson has required structure', () => {
    for (const l of grammarLessons) {
      expect(l.id, 'lesson missing id').toBeTruthy();
      expect(l.title, `lesson ${l.id} missing title`).toBeTruthy();
      expect(Array.isArray(l.formula) && l.formula.length > 0, `lesson ${l.id} bad formula`).toBe(true);
      expect(Array.isArray(l.examples) && l.examples.length > 0, `lesson ${l.id} bad examples`).toBe(true);
      expect(Array.isArray(l.practice) && l.practice.length > 0, `lesson ${l.id} bad practice`).toBe(true);
    }
  });

  it('every lesson id is unique', () => {
    const ids = grammarLessons.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every practice question points to a valid option index', () => {
    for (const l of grammarLessons) {
      for (const [i, p] of l.practice.entries()) {
        expect(Array.isArray(p.options) && p.options.length >= 2, `lesson ${l.id} q#${i} bad options`).toBe(true);
        expect(p.answerIndex, `lesson ${l.id} q#${i} bad answerIndex`).toBeGreaterThanOrEqual(0);
        expect(p.answerIndex, `lesson ${l.id} q#${i} bad answerIndex`).toBeLessThan(p.options.length);
        expect(typeof p.explanation, `lesson ${l.id} q#${i} missing explanation`).toBe('string');
      }
    }
  });

  it('grammarPractice items are well-formed', () => {
    for (const p of grammarPractice) {
      expect(p.id).toBeTruthy();
      expect(p.options.length >= 2).toBe(true);
      expect(p.answerIndex).toBeGreaterThanOrEqual(0);
      expect(p.answerIndex).toBeLessThan(p.options.length);
    }
  });
});

describe('sentence data', () => {
  it('every sentence has required fields and unique id', () => {
    const ids = new Set();
    for (const s of dailySentences) {
      expect(ids.has(s.id), 'duplicate sentence id').toBe(false);
      ids.add(s.id);
      expect(typeof s.en).toBe('string');
      expect(s.en.length).toBeGreaterThan(0);
      expect(typeof s.vi).toBe('string');
      expect(s.vi.length).toBeGreaterThan(0);
      expect(typeof s.pron).toBe('string');
      expect(Array.isArray(s.breakdown)).toBe(true);
    }
  });
});