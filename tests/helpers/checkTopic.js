import { romajiMatchesReading, kanaToRomaji } from '../../src/lib/kanaTranslit.js';

const JAPANESE = /[\u3040-\u30ff\u4e00-\u9fff]/;
const KANA_ONLY = /[\u3040-\u309f]/;
const TYPES = ['noun', 'verb', 'adjective', 'phrase', 'adverb', 'particle', 'number'];
const MIX = /[\u3040-\u9fff][A-Za-z]|[A-Za-z][\u3040-\u9fff]/;
const PUNCT = /[.,;:!?]/;

export async function checkTopic(mod, expectedId) {
  const bad = [];
  const { words, topic } = mod;
  if (topic.id !== expectedId) bad.push(`topic.id=${topic.id}`);
  if (!topic.nameVi || !topic.name) bad.push('thiếu tên topic');
  if (!/^linear-gradient/.test(topic.gradient)) bad.push('gradient sai định dạng');

  for (const w of words) {
    const tag = `#${w.id} ${w.word}`;
    if (!JAPANESE.test(w.word)) bad.push(`${tag}: word không phải tiếng Nhật`);
    // Kana thuần thì bắt buộc phải là hiragana để đọc được.
    if (KANA_ONLY.test(w.word) && !KANA_ONLY.test(w.reading)) bad.push(`${tag}: reading phải là hiragana`);
    if (!KANA_ONLY.test(w.reading)) {
      if (w.reading !== w.word) bad.push(`${tag}: reading không hợp lệ (${w.reading})`);
    } else if (!romajiMatchesReading(w.reading, w.romaji)) {
      bad.push(`${tag}: romaji ${w.romaji} != ${kanaToRomaji(w.reading)}`);
    }
    if (!/^[a-z]+(?: [a-z]+)*$/.test(w.romaji)) bad.push(`${tag}: romaji sai định dạng`);
    if (!w.meaning) bad.push(`${tag}: thiếu nghĩa`);
    if (!w.example || !JAPANESE.test(w.example)) bad.push(`${tag}: ví dụ không phải tiếng Nhật`);
    if (!w.exampleMeaning) bad.push(`${tag}: thiếu nghĩa ví dụ`);
    if (!TYPES.includes(w.type)) bad.push(`${tag}: type lạ (${w.type})`);
    for (const f of ['word', 'reading', 'example']) {
      if (MIX.test(w[f])) bad.push(`${tag}: ${f} lẫn chữ Latin`);
    }
    if (PUNCT.test(w.example.replace(/[\u3002\u3001]/g, ''))) bad.push(`${tag}: dấu câu Latin trong ví dụ`);
  }

  const ids = words.map(w => w.id);
  if (ids.join(',') !== words.map((_, i) => i + 1).join(',')) bad.push('id không liên tục từ 1');
  for (const key of ['word', 'meaning']) {
    const seen = new Set();
    for (const w of words) {
      if (seen.has(w[key])) bad.push(`trùng ${key}: ${w[key]}`);
      seen.add(w[key]);
    }
  }
  return bad;
}