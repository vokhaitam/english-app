import { describe, it, expect } from 'vitest';
import { tokenizeSentence, playableSentences } from '../src/lib/sentenceUtils';
import { japaneseEqual } from '../src/lib/langUtils';
import { dailySentences } from '../src/data/ja/sentences';

describe('tokenizeSentence', () => {
  it('tách tiếng Anh theo khoảng trắng', () => {
    expect(tokenizeSentence('I love learning English', false)).toEqual([
      'I', 'love', 'learning', 'English',
    ]);
    expect(tokenizeSentence('  spaced   out  ', false)).toEqual(['spaced', 'out']);
  });

  it('tách tiếng Nhật thành từ thật, bỏ dấu câu', () => {
    const tokens = tokenizeSentence('私は学生です。', true);
    expect(tokens.length).toBeGreaterThanOrEqual(2);
    expect(tokens).toContain('学生');
    for (const t of tokens) expect(t).toMatch(/[\p{L}\p{N}]/u);
  });

  it('ghép lại được câu gốc sau khi bỏ dấu câu', () => {
    for (const s of dailySentences) {
      const tokens = tokenizeSentence(s.en, true);
      expect(tokens.length, s.en).toBeGreaterThanOrEqual(1);
      expect(japaneseEqual(tokens.join(''), s.en), s.en).toBe(true);
    }
  });

  it('pool câu chơi được: ≥3 mẩu và đủ tối thiểu 4 câu', () => {
    const pool = playableSentences(dailySentences, true);
    expect(pool.length).toBeGreaterThanOrEqual(4);
    for (const s of pool) {
      expect(tokenizeSentence(s.en, true).length, s.en).toBeGreaterThanOrEqual(3);
    }
    // Tiếng Anh không lọc gì.
    expect(playableSentences(dailySentences, false)).toHaveLength(dailySentences.length);
  });

  it('bộ câu JA đủ trường, id và nội dung không trùng', () => {
    expect(dailySentences.length).toBeGreaterThanOrEqual(60);
    const ids = new Set();
    const ens = new Set();
    for (const s of dailySentences) {
      expect(ids.has(s.id), `trùng id ${s.id}`).toBe(false);
      expect(ens.has(s.en), `trùng câu: ${s.en}`).toBe(false);
      ids.add(s.id);
      ens.add(s.en);
      expect(s.pron, s.en).toMatch(/^[a-z]+(?: [a-z]+)*$/);
      expect(s.en, s.en).not.toMatch(/[A-Za-z]/);
      expect(s.en, s.en).not.toMatch(/[.,;:!?]/);
      expect(s.vi, s.en).toBeTruthy();
      expect(s.grammar?.name, s.en).toBeTruthy();
      expect(s.breakdown.length, s.en).toBeGreaterThanOrEqual(2);
    }
  });
});
