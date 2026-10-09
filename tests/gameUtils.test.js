import { describe, it, expect } from 'vitest';
import {
  shuffle, pickRandom, scrambleWord, splitIntoWords, buildChoiceOptions,
} from '../src/lib/gameUtils';

// RNG cố định để kết quả lặp lại được.
function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('shuffle', () => {
  it('keeps the same elements', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const out = shuffle(arr, seededRng());
    expect([...out].sort()).toEqual([...arr].sort());
    expect(arr).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('does not mutate the input', () => {
    const arr = [1, 2, 3];
    shuffle(arr, seededRng());
    expect(arr).toEqual([1, 2, 3]);
  });

  it('returns a new array instance', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr, seededRng())).not.toBe(arr);
  });
});

describe('pickRandom', () => {
  it('returns n items or fewer when the pool is smaller', () => {
    expect(pickRandom([1, 2, 3], 10, seededRng())).toHaveLength(3);
    expect(pickRandom([1, 2, 3, 4, 5], 3, seededRng())).toHaveLength(3);
    expect(pickRandom([], 5, seededRng())).toHaveLength(0);
  });
});

describe('scrambleWord', () => {
  it('is a permutation of the original letters', () => {
    const word = 'vocabulary';
    const out = scrambleWord(word, seededRng());
    expect([...out].sort()).toEqual([...word].sort());
  });

  it('never returns the original order for distinct-letter words', () => {
    for (let seed = 1; seed <= 20; seed++) {
      expect(scrambleWord('abcdef', seededRng(seed))).not.toBe('abcdef');
    }
  });

  it('handles one-letter and empty strings', () => {
    expect(scrambleWord('a', seededRng())).toBe('a');
    expect(scrambleWord('', seededRng())).toBe('');
  });
});

describe('splitIntoWords', () => {
  it('splits on any whitespace and drops empty pieces', () => {
    expect(splitIntoWords('  I   love\tlearning  ')).toEqual(['I', 'love', 'learning']);
    expect(splitIntoWords('word')).toEqual(['word']);
    expect(splitIntoWords('   ')).toEqual([]);
  });
});

describe('buildChoiceOptions', () => {
  const correct = { id: 1, word: 'apple', meaning: 'quả táo' };
  const pool = [
    correct,
    { id: 2, word: 'banana', meaning: 'quả chuối' },
    { id: 3, word: 'cherry', meaning: 'quả anh đào' },
    { id: 4, word: 'grape', meaning: 'quả nho' },
    { id: 5, word: 'lemon', meaning: 'quả chanh' },
  ];

  it('returns exactly 4 options including the correct one', () => {
    const out = buildChoiceOptions(correct, pool, 4, seededRng());
    expect(out).toHaveLength(4);
    expect(out).toContain(correct);
  });

  it('never duplicates the correct answer', () => {
    const out = buildChoiceOptions(correct, pool, 4, seededRng());
    expect(out.filter(o => o.id === correct.id)).toHaveLength(1);
  });

  it('falls back to fewer options when the pool is small', () => {
    const out = buildChoiceOptions(correct, [correct, { id: 9, word: 'fig', meaning: 'quả sung' }], 4, seededRng());
    expect(out.length).toBeLessThanOrEqual(2);
    expect(out).toContain(correct);
  });

  it('does not reuse words from the pool', () => {
    const out = buildChoiceOptions(correct, pool, 4, seededRng());
    const ids = out.map(o => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
