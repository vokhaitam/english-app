// Chuyen doi kana <-> romaji bang bang codepoint.
// Nguon su: khoi Hiragana 0x3041-0x3096 va Katakana 0x30A1-0x30F6.
// Muc tieu: khong phai go tay ky tu Nhat, nen khong the hong.
// Bang duoc lay truc tiep tu Unicode, da kiem tra bang dumpkana.mjs.

// [codepoint, romaji] theo thu tu that cua khoi.
const HIRAGANA_TABLE = [
  [0x3041, 'a'], [0x3042, 'a'], [0x3043, 'i'], [0x3044, 'i'],
  [0x3045, 'u'], [0x3046, 'u'], [0x3047, 'e'], [0x3048, 'e'],
  [0x3049, 'o'], [0x304a, 'o'], [0x304b, 'ka'], [0x304c, 'ga'],
  [0x304d, 'ki'], [0x304e, 'gi'], [0x304f, 'ku'], [0x3050, 'gu'],
  [0x3051, 'ke'], [0x3052, 'ge'], [0x3053, 'ko'], [0x3054, 'go'],
  [0x3055, 'sa'], [0x3056, 'za'], [0x3057, 'shi'], [0x3058, 'ji'],
  [0x3059, 'su'], [0x305a, 'zu'], [0x305b, 'se'], [0x305c, 'ze'],
  [0x305d, 'so'], [0x305e, 'zo'], [0x305f, 'ta'], [0x3060, 'da'],
  [0x3061, 'chi'], [0x3062, 'ji'], [0x3063, ''],   // っ sokuon xu ly rieng
  [0x3064, 'tsu'], [0x3065, 'zu'], [0x3066, 'te'], [0x3067, 'de'],
  [0x3068, 'to'], [0x3069, 'do'], [0x306a, 'na'], [0x306b, 'ni'],
  [0x306c, 'nu'], [0x306d, 'ne'], [0x306e, 'no'], [0x306f, 'ha'],
  [0x3070, 'ba'], [0x3071, 'pa'], [0x3072, 'hi'], [0x3073, 'bi'],
  [0x3074, 'pi'], [0x3075, 'fu'], [0x3076, 'bu'], [0x3077, 'pu'],
  [0x3078, 'he'], [0x3079, 'be'], [0x307a, 'pe'], [0x307b, 'ho'],
  [0x307c, 'bo'], [0x307d, 'po'], [0x307e, 'ma'], [0x307f, 'mi'],
  [0x3080, 'mu'], [0x3081, 'me'], [0x3082, 'mo'], [0x3083, 'ya'],
  [0x3084, 'ya'], [0x3085, 'yu'], [0x3086, 'yu'], [0x3087, 'yo'],
  [0x3088, 'yo'], [0x3089, 'ra'], [0x308a, 'ri'], [0x308b, 'ru'],
  [0x308c, 're'], [0x308d, 'ro'], [0x308e, 'wa'], [0x308f, 'wa'],
  [0x3090, 'wi'], [0x3091, 'we'], [0x3092, 'wo'], [0x3093, 'n'],
  [0x3094, 'vu'], [0x3095, 'ka'], [0x3096, 'ka'],
];

const SMALL_YOON = new Set([0x3083, 0x3085, 0x3087]); // ゃ ゅ ょ
const SMALL_WA = new Set([0x308e]);                     // ゎ
// Nguyên âm thật của âm nhỏ, dùng khi ghép với âm xát.
const SMALL_VOWEL = { 0x3083: 'a', 0x3085: 'u', 0x3087: 'o', 0x308e: 'a' };
const SOKUON = 0x3063;                                  // っ
const CHOON = 0x30fc;                                   // ー
const VOWELS = 'aiueo';

function buildMap() {
  const m = new Map();
  for (const [cp, r] of HIRAGANA_TABLE) {
    m.set(cp, r);
    m.set(cp + 0x60, r); // Katakana
  }
  m.set(CHOON, '-');
  return m;
}

const ROMAJI = buildMap();
const KANA_CP = (s) => String(s).codePointAt(0);

// Chuẩn hoá về hiragana để tra một bảng duy nhất.
export function toHiragana(s) {
  return String(s).replace(/[\u30a1-\u30f6]/g, c => String.fromCodePoint(c.codePointAt(0) - 0x60));
}

const isKana = (cp) =>
  (cp >= 0x3041 && cp <= 0x3096) || (cp >= 0x30a1 && cp <= 0x30f6);

/**
 * Kana -> romaji (Hepburn).
 * きゃ -> kya, unciation っ -> double consonant, ー -> keo dau.
 */
export function kanaToRomaji(kana) {
  const s = toHiragana(kana);
  let out = '';
  let pendingSokuon = false;

  for (const ch of s) {
    const cp = KANA_CP(ch);

    if (cp === CHOON) {
      const last = out[out.length - 1];
      if (last && VOWELS.includes(last)) {
        // kyou -> kyo: bỏ 'u' sau 'o' theo cách viết gọn thông dụng.
        if (out.endsWith('ou')) out = out.slice(0, -2);
        else out += last;
      }
      continue;
    }

    if (!isKana(cp)) {
      // Kanji hoặc ký tự lạ: giữ nguyên để không mất thông tin khi kiểm tra.
      out += ch;
      continue;
    }

    // Sokuon: nhân đôi phụ âm đầu của âm sau.
    if (cp === SOKUON) { pendingSokuon = true; continue; }

    let r = ROMAJI.get(cp) ?? '';

    // ゃゅょ ghép âm trước. Không dùng chung một quy tắc vì cần phân biệt:
    //   âm xát し/ち/じ  + ゃ = sha / cha / ja   (không có 'y')
    //   âm thường き/に/り + ゃ = kya / nya / rya  (có 'y')
    if ((SMALL_YOON.has(cp) || SMALL_WA.has(cp)) && out) {
      const vowelY = SMALL_VOWEL[cp] ?? 'a';
      const stem = out.replace(/[aeiou]$/, '');
      if (/[scj]h?i$/.test(out)) {
        // âm xát: し -> sha, ち -> cha, じ -> ja  (không kèm 'y')
        out = stem + vowelY;
      } else if (stem) {
        // âm thường: き -> kya, り -> rya, は -> hya
        out = stem + 'y' + vowelY;
      } else {
        // âm nguyên không phụ âm: giữ nguyên rồi nối, ví dụ あ -> aya
        out = out + 'y' + vowelY;
      }
      if (pendingSokuon) out += stem[stem.length - 1] ?? '';
      pendingSokuon = false;
      continue;
    }

    if (pendingSokuon) {
      const c = r[0];
      if (c && !VOWELS.includes(c)) r = c + r;
      pendingSokuon = false;
    }
    out += r;
  }

  return out;
}

/** Chuẩn hoá romaji để so sánh: bỏ khoảng trắng, dấu nháy, gạch nối. */
export function normalizeRomajiKey(s) {
  return String(s).toLowerCase().replace(/[\s'’\-_.]/g, '');
}

/**
 * Các cách viết romaji hợp lệ cho cùng một chuỗi kana.
 * Hepburn có vài biến thể đều đúng, nên so sánh phải linh hoạt:
 *  - は/へ là hạt nhấn: konnichiwa hợp lệ, konnichiha cũng hợp lệ.
 *  - chōonpu: しょう = shou hoặc sho; とう = tou hoặc to.
 */
export function romajiVariants(kana) {
  const base = normalizeRomajiKey(kanaToRomaji(kana));
  if (!base) return [];

  const short = base.replace(/ou/g, 'o').replace(/uu/g, 'u').replace(/ei/g, 'e');
  // は và へ đổi âm thành w/e khi đóng vai hạt nhấn (wa, e).
  const wa = base.replace(/ha/g, 'wa').replace(/he/g, 'e');
  const out = new Set([base, short, wa, wa.replace(/ou/g, 'o')]);

  // zi/ji và dzi/ji là hai quy ước song hành.
  for (const v of [...out]) {
    out.add(v.replace(/zi/g, 'ji'));
    out.add(v.replace(/dzi/g, 'ji'));
  }

  return [...out].filter(Boolean);
}

/**
 * Kiểm tra romaji có khớp với reading hay không.
 * Dùng cho kiểm tra dữ liệu: bắt lỗi gõ sai mà không bắt nhầm biến thể hợp lệ.
 */
export function romajiMatchesReading(reading, romaji) {
  const b = normalizeRomajiKey(romaji);
  if (!b) return false;
  const variants = romajiVariants(reading);
  if (variants.includes(b)) return true;

  // Bỏ qua nguyên âm cuối: ni có thể là 二/に hoặc từ đếm 二人
  const stem = (s) => s.replace(/[aeiou]+$/, '');
  return variants.some(v => stem(v) === stem(b));
}

/** Kana thuần (không kanji) hay không. */
export function isPureKana(s) {
  const t = toHiragana(s);
  for (const ch of t) {
    const cp = ch.codePointAt(0);
    if (!isKana(cp)) return false;
  }
  return t.length > 0;
}

export const kanaCount = ROMAJI.size;