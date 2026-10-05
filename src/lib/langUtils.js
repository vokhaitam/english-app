// Ngôn ngữ và so khớp chuỗi đa script (Latin tiếng Anh, Kana/Kanji tiếng Nhật).

export const EN = 'en';
export const JA = 'ja';

const COMBINING_MARKS = /[\u0300-\u036f]/g;
const JA_PUNCT = /[\u3000-\u303f\uff01-\uff65\s]/g;

// ---- Chuẩn hoá cho tiếng Anh (Latin) ----
export function normalizeLatin(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]/g, '')
    .replace(/[\u2018\u2019`]/g, "'")
    .trim();
}

export function stripLatinTone(s) {
  return s.normalize('NFD').replace(COMBINING_MARKS, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function latinEqual(input, target) {
  const a = normalizeLatin(input);
  const b = normalizeLatin(target);
  if (!a || !b) return false;
  if (a === b) return true;
  const aT = stripLatinTone(a);
  const bT = stripLatinTone(b);
  return aT === bT || a === bT || aT === b;
}

// ---- Chuẩn hoá cho tiếng Nhật ----
// Katakana -> Hiragana, bỏ dấu câu + khoảng trắng, gộp khoảng trắng dài (。) về một dấu chấm.
export function katakanaToHiragana(s) {
  return String(s).replace(/[\uff66-\uff9d]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export function normalizeJapanese(s) {
  return katakanaToHiragana(
    String(s)
      .normalize('NFKC')
      .replace(/[\u3001\u3002\uff0c\uff0e]/g, '\u3002')
      .replace(JA_PUNCT, '')
      .trim()
  );
}

export function japaneseEqual(input, target) {
  const a = normalizeJapanese(input);
  const b = normalizeJapanese(target);
  if (!a || !b) return false;
  return a === b;
}

// ---- Romaji: so khớp cách gõ bàn phím ----
export function normalizeRomaji(s) {
  return normalizeLatin(s)
    .replace(/[-']/g, '')
    .replace(/\s+/g, '');
}

export function romajiEqual(input, target) {
  const a = normalizeRomaji(input);
  const b = normalizeRomaji(target);
  if (!a || !b) return false;
  return a === b;
}

// ---- Tra cứu ngôn ngữ hiện tại ----
export const isJapanese = (lang) => lang === JA;
export const isLatin = (lang) => lang === EN;

// Tách phần tùy chọn trong nghĩa tiếng Việt: "mì (cá, bánh)" -> ["mì", "cá", "bánh"]
export function meaningChecks(meaning) {
  const noParens = meaning.replace(/[()（）][^)）]*[)）]/g, '').trim();
  const segs = meaning.split(/[,;•/]/).map(s => s.trim()).filter(Boolean);
  return [...new Set([meaning, noParens, ...segs])].filter(Boolean);
}

// Kiểm tra câu trả lời có đúng không, tự chọn cách so khớp theo ngôn ngữ.
export function answerMatches(input, target, lang) {
  if (!input || !target) return false;
  if (isJapanese(lang)) return japaneseEqual(input, target);
  return latinEqual(input, target) || latinEqual(input, target.replace(/'/g, ''));
}

// Tra về mọi biến thể hợp lệ của câu trả lời cho một từ, theo ngôn ngữ.
export function acceptedAnswers(word, lang, dir) {
  if (isJapanese(lang)) {
    // Gõ tiếng Nhật = gõ romaji, nên nghĩa vẫn trả lời bằng tiếng Việt
    // hoặc chính tả kana/kanji đã hiển thị.
    if (dir === 'vi2target') {
      const out = [];
      if (word.romaji) out.push(word.romaji);
      if (word.reading) out.push(word.reading);
      if (word.word) out.push(word.word);
      return out;
    }
    return meaningChecks(word.meaning);
  }
  if (dir === 'vi2target') return [word.word];
  return meaningChecks(word.meaning);
}