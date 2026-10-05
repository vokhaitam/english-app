import { describe, it, expect } from 'vitest';
import { romajiMatchesReading, kanaToRomaji } from '../src/lib/kanaTranslit';
import { topic, words } from '../src/data/ja/vocab/greetings';
import { kanaChart, kanaRows, counters, numberWords } from '../src/data/ja/kana';

const JAPANESE = /[\u3040-\u30ff\u4e00-\u9fff]/;

/**
 * Dữ liệu tiếng Nhật phải sạch tuyệt đối: người học không tự phát hiện được
 * từ sai. Các kiểm tra dưới đây bắt được loại lỗi hay phát sinh khi sinh dữ liệu:
 * chữ lạ lẫn vào (Latin, Cyrill, chữ Hán giả), reading sai, id lệch, trùng từ.
 */
describe('kana table', () => {
  it('mọi âm có romaji khớp ký tự kana', () => {
    const bad = kanaChart.filter(c => !romajiMatchesReading(c.kana, c.romaji));
    expect(bad.map(b => `${b.kana}=${b.romaji}`)).toEqual([]);
  });

  it('bảng kana có 46 âm cơ bản', () => {
    expect(kanaChart).toHaveLength(46);
  });

  it('không có ô trống trong hàng đã định nghĩa', () => {
    for (const row of kanaRows) {
      for (const key of ['voiced', 'semi']) {
        if (row[key]) expect(row[key]).not.toHaveLength(0);
      }
    }
  });

  it('mọi lượng từ đếm có ví dụ tiếng Nhật thuần', () => {
    for (const c of counters) {
      expect(c.kanji, c.read).toMatch(JAPANESE);
      expect(c.example, c.read).toMatch(JAPANESE);
      // Ví dụ phải chứa chính lượng từ, ví dụ 三人 trong 学生三人
      expect(c.example, c.read).toContain(c.kanji);
    }
  });

  it('số đếm có kana và romaji khớp nhau', () => {
    for (const n of numberWords) {
      expect(romajiMatchesReading(n.kana, n.romaji), `${n.kanji} ${n.kana} ${n.romaji}`).toBe(true);
    }
  });
});

describe('greetings topic', () => {
  it('đủ 70 từ với id liên tục từ 1', () => {
    expect(words).toHaveLength(70);
    expect(words.map(w => w.id)).toEqual(Array.from({ length: 70 }, (_, i) => i + 1));
  });

  it('không trùng từ hoặc trùng nghĩa trong cùng chủ đề', () => {
    const seenWord = new Set();
    const seenMeaning = new Set();
    for (const w of words) {
      expect(seenWord.has(w.word), `trùng từ: ${w.word}`).toBe(false);
      expect(seenMeaning.has(w.meaning), `trùng nghĩa: ${w.word} = ${w.meaning}`).toBe(false);
      seenWord.add(w.word);
      seenMeaning.add(w.meaning);
    }
  });

  it('mọi từ có đủ trường và word là tiếng Nhật', () => {
    for (const w of words) {
      expect(w.word, `id ${w.id}`).toMatch(JAPANESE);
      expect(w.reading, `id ${w.id} (${w.word})`).toMatch(/[\u3040-\u309f]/);
      expect(w.romaji, `id ${w.id} (${w.word})`).toMatch(/^[a-z]+(?: [a-z]+)*$/);
      expect(w.meaning, `id ${w.id}`).toBeTruthy();
      expect(w.example, `id ${w.id}`).toMatch(JAPANESE);
      expect(w.exampleMeaning, `id ${w.id}`).toBeTruthy();
      expect(['noun', 'verb', 'adjective', 'phrase', 'adverb', 'particle', 'number']).toContain(w.type);
    }
  });

  it('romaji khớp reading', () => {
    const bad = words
      .filter(w => !romajiMatchesReading(w.reading, w.romaji))
      .map(w => `#${w.id} ${w.word}: ${w.romaji} != ${kanaToRomaji(w.reading)}`);
    expect(bad).toEqual([]);
  });

  it('không lẫn ngôn ngữ khác trong word, reading, example', () => {
    for (const w of words) {
      for (const field of ['word', 'reading', 'example']) {
        const v = w[field];
        // Chuỗi phải là kana/kanji thuần; không có từ Latin đứng liền kanji/kana.
        expect(v, `id ${w.id} ${field}`).not.toMatch(/[\u3040-\u9fff][A-Za-z]|[A-Za-z][\u3040-\u9fff]/);
        expect(v, `id ${w.id} ${field}`).not.toMatch(/[\u0400-\u04ff]/); // Cyrill
        expect(v, `id ${w.id} ${field}`).not.toMatch(/[\u0900-\u097f]/); // Devanagari
      }
      // Dấu câu trong ví dụ chỉ được là 。 hoặc 、
      expect(w.example.replace(/[\u3002\u3001]/g, ''), `id ${w.id}`).not.toMatch(/[.,;:!?]/);
    }
  });

  it('topic khai báo đúng', () => {
    expect(topic.id).toBe('ja-greetings');
    expect(topic.level).toBe('n5');
    expect(topic.nameVi).toBeTruthy();
  });

  it('không còn chữ rác sót lại trong file', () => {
    // Những mẫu từng xuất hiện khi sinh dữ liệu bị lẫn.
    for (const w of words) {
      const blob = `${w.word} ${w.reading} ${w.example} ${w.meaning} ${w.exampleMeaning}`;
      expect(blob, `id ${w.id}`).not.toMatch(/Attachment|ANALYZER|HOMECOMING|AUTOSOM|Geraldo|GRAMMAR_HINT|INTRODUCTION|MAYBE|Recommendation/i);
    }
  });
});

describe('english data is untouched', () => {
  it('vẫn còn data tiếng Anh gốc', async () => {
    const en = await import('../src/data/vocabulary');
    expect(en.levels.length).toBe(3);
    expect(en.topics.length).toBe(26);
    expect(Object.keys(en.vocabulary).length).toBe(26);
    expect(en.getAllWords().length).toBe(2600);
  });
});