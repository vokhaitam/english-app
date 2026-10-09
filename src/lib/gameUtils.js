// Helper thuần cho các game — không phụ thuộc React/DOM, dễ test.

export function shuffle(arr, rng = Math.random) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandom(arr, n, rng = Math.random) {
  return shuffle(arr, rng).slice(0, Math.min(n, arr.length));
}

// Xáo trộn chữ cái của một từ, đảm bảo kết quả khác từ gốc.
export function scrambleWord(word, rng = Math.random) {
  const chars = [...String(word)];
  if (chars.length < 2) return chars.join('');
  let out = chars.join('');
  for (let attempt = 0; attempt < 12 && out === chars.join(''); attempt++) {
    out = shuffle(chars, rng).join('');
  }
  return out;
}

// Tách câu thành các mảnh (từ) để xếp lại.
export function splitIntoWords(sentence) {
  return String(sentence).trim().split(/\s+/).filter(Boolean);
}

// Ghép bộ lựa chọn: gồm đúng + (count-1) đáp án sai từ pool, không trùng nội dung.
export function buildChoiceOptions(correct, pool, count = 4, rng = Math.random) {
  const used = new Set([String(correct.word).toLowerCase(), String(correct.meaning).toLowerCase()]);
  const wrong = [];
  for (const w of shuffle(pool, rng)) {
    if (wrong.length >= count - 1) break;
    if (w.word === correct.word) continue;
    const wText = String(w.word).toLowerCase();
    const mText = String(w.meaning).toLowerCase();
    if (used.has(wText) || used.has(mText)) continue;
    used.add(wText);
    used.add(mText);
    wrong.push(w);
  }
  return shuffle([correct, ...wrong], rng);
}
