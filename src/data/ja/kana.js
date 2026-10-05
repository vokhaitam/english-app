// Bảng kana gốc (五十音), dựng từ mã Unicode nên không thể bị lỗi gõ tay.
// 0x3042..0x3093 là khối Hiragana; Katakana = Hiragana + 0x60.
import { kanaToRomaji as translit, romajiMatchesReading } from '../../lib/kanaTranslit.js';

const kana = (cp, romaji) => ({
  kana: String.fromCodePoint(cp),
  romaji,
  // Dùng translit để kiểm tra bảng ngay khi nạp module.
  _ok: romajiMatchesReading(String.fromCodePoint(cp), romaji),
});

// [mã, romaji] theo đúng thứ tự đã dump từ Unicode.
const ROWS = [
  {
    id: 'a', row: 'a', cells: [
      [0x3042, 'a'], [0x3044, 'i'], [0x3046, 'u'], [0x3048, 'e'], [0x304a, 'o'],
    ],
  },
  {
    id: 'ka', row: 'ka', cells: [
      [0x304b, 'ka'], [0x304d, 'ki'], [0x304f, 'ku'], [0x3051, 'ke'], [0x3053, 'ko'],
    ],
    voiced: [
      [0x304c, 'ga'], [0x304e, 'gi'], [0x3050, 'gu'], [0x3052, 'ge'], [0x3054, 'go'],
    ],
  },
  {
    id: 'sa', row: 'sa', cells: [
      [0x3055, 'sa'], [0x3057, 'shi'], [0x3059, 'su'], [0x305b, 'se'], [0x305d, 'so'],
    ],
    voiced: [
      [0x3056, 'za'], [0x3058, 'ji'], [0x305a, 'zu'], [0x305c, 'ze'], [0x305e, 'zo'],
    ],
  },
  {
    id: 'ta', row: 'ta', cells: [
      [0x305f, 'ta'], [0x3061, 'chi'], [0x3064, 'tsu'], [0x3066, 'te'], [0x3068, 'to'],
    ],
    voiced: [
      [0x3060, 'da'], [0x3062, 'ji'], [0x3065, 'zu'], [0x3067, 'de'], [0x3069, 'do'],
    ],
  },
  {
    id: 'na', row: 'na', cells: [
      [0x306a, 'na'], [0x306b, 'ni'], [0x306c, 'nu'], [0x306d, 'ne'], [0x306e, 'no'],
    ],
  },
  {
    id: 'ha', row: 'ha', cells: [
      [0x306f, 'ha'], [0x3072, 'hi'], [0x3075, 'fu'], [0x3078, 'he'], [0x307b, 'ho'],
    ],
    voiced: [
      [0x3070, 'ba'], [0x3073, 'bi'], [0x3076, 'bu'], [0x3079, 'be'], [0x307c, 'bo'],
    ],
    semi: [
      [0x3071, 'pa'], [0x3074, 'pi'], [0x3077, 'pu'], [0x307a, 'pe'], [0x307d, 'po'],
    ],
  },
  {
    id: 'ma', row: 'ma', cells: [
      [0x307e, 'ma'], [0x307f, 'mi'], [0x3080, 'mu'], [0x3081, 'me'], [0x3082, 'mo'],
    ],
  },
  {
    id: 'ya', row: 'ya', cells: [
      [0x3084, 'ya'], null, [0x3086, 'yu'], null, [0x3088, 'yo'],
    ],
  },
  {
    id: 'ra', row: 'ra', cells: [
      [0x3089, 'ra'], [0x308a, 'ri'], [0x308b, 'ru'], [0x308c, 're'], [0x308d, 'ro'],
    ],
  },
  {
    id: 'wa', row: 'wa', cells: [
      [0x308f, 'wa'], null, null, null, null,
    ],
    archaic: [[0x3090, 'i'], [0x3091, 'e']],
    extra: [[0x3092, 'wo'], [0x3093, 'n']],
  },
];

const build = (list) => list.filter(Boolean).map(([cp, r]) => kana(cp, r));

export const kanaRows = ROWS.map(r => ({
  id: r.id,
  row: r.row,
  cells: r.cells.map(c => (c ? kana(c[0], c[1]) : null)),
  voiced: r.voiced ? build(r.voiced) : null,
  semi: r.semi ? build(r.semi) : null,
  archaic: r.archaic ? build(r.archaic) : null,
  extra: r.extra ? build(r.extra) : null,
}));

// Âm nhỏ (小書き). Chỉ dùng sau một âm khác.
export const kanaYoOn = [
  [0x3083, 'ya'], [0x3085, 'yu'], [0x3087, 'yo'],
  [0x3041, 'a'], [0x3043, 'i'], [0x3045, 'u'], [0x3047, 'e'], [0x3049, 'o'],
].map(([cp, r]) => ({
  ...kana(cp, r),
  note: 'Chỉ dùng sau một âm khác, ví dụ きょ đọc là kyo',
}));

// Âm đặc biệt không theo hàng nào.
export const kanaSpecial = [
  { ...kana(0x3093, 'n'), note: 'Dùng sau nguyên âm không tạo được âm mới, ví dụ せんに' },
  { ...kana(0x3094, 'vu'), note: 'Ít dùng, ví dụ ヴァイオリン (violin)' },
];

// 46 âm gốc + を + ん = 48 mục học chính.
export const kanaChart = [
  ...ROWS.flatMap(r => build(r.cells).map(c => ({ ...c, row: r.row }))),
  { ...kana(0x3092, 'wo'), row: 'wa', particle: true },
  { ...kana(0x3093, 'n'), row: 'n', particle: true },
];

// Bảng tra nhanh kana -> romaji, dùng chung với lib/kanaTranslit.
export const kanaToRomaji = translit;

// Đếm từ theo loại danh từ.
export const counters = [
  { kanji: '人', read: 'にん', count: 'người', example: '学生三人', mean: 'ba học sinh',
    note: 'Dưới 10 dùng ひとり、ふたり、みっつ…' },
  { kanji: '枚', read: 'まい', count: 'vật phẳng: giấy, ảnh, thẻ, bàn', example: '切手五枚', mean: 'năm phong thư' },
  { kanji: '本', read: 'ほん / ぽん', count: 'vật dài cầm được: sách, bút, chai', example: '本を三冊', mean: 'ba cuốn sách',
    note: 'Số 1–3 đọc  いっぽん / にほん / さんぽん' },
  { kanji: '台', read: 'だい', count: 'máy móc, xe, thiết bị', example: '車が一台', mean: 'một chiếc xe' },
  { kanji: '匹', read: 'ひき', count: 'động vật nhỏ: chó, mèo, chim', example: '猫が二匹', mean: 'hai con mèo' },
  { kanji: '頭', read: 'とう', count: 'động vật lớn: bò, ngựa, voi', example: '牛が一頭', mean: 'một con bò' },
  { kanji: '杯', read: 'はい', count: 'cốc, chén', example: '茶が一杯', mean: 'một tách trà' },
  { kanji: '着', read: 'ちゃく', count: 'bộ quần áo', example: '服を三着', mean: 'ba bộ quần áo' },
  { kanji: '階', read: 'かい', count: 'tầng nhà', example: '三階', mean: 'tầng ba' },
  { kanji: '番', read: 'ばん', count: 'thứ tự, số hiệu', example: '一番', mean: 'số một' },
  { kanji: '度', read: 'ど', count: 'số lần', example: '三度', mean: 'ba lần' },
  { kanji: '軒', read: 'けん', count: 'cửa hàng, tòa nhà', example: '店が三軒', mean: 'ba cửa hàng' },
  { kanji: '束', read: 'そく', count: 'bó, túi', example: '花が一束', mean: 'một bó hoa' },
  { kanji: '組', read: 'そ', count: 'lớp, nhóm', example: '一組', mean: 'lớp một' },
  { kanji: '本', read: 'ほん', count: 'chai lon, lon bia', example: 'ビールを三本', mean: 'ba lon bia' },
  { kanji: '匹', read: 'ひき', count: 'cá, rắn', example: '魚が一匹', mean: 'một con cá' },
  { kanji: '艘', read: 'そう', count: 'tàu thuyền', example: '船が一艘', mean: 'một chiếc tàu' },
];

// Số đếm và cách đọc.
export const numberWords = [
  { kanji: '一', kana: 'いち', romaji: 'ichi', note: 'Trong lượng từ đếm người: 一人 = hitori' },
  { kanji: '二', kana: 'に', romaji: 'ni', note: 'Lượng từ đếm người: 二人 = futari' },
  { kanji: '三', kana: 'さん', romaji: 'san', note: 'Lượng từ đếm người: 三人 = sannin' },
  { kanji: '四', kana: 'よん', romaji: 'yon', note: 'Trong bốn mùa: 四季 = shiki' },
  { kanji: '五', kana: 'ご', romaji: 'go' },
  { kanji: '六', kana: 'ろく', romaji: 'roku' },
  { kanji: '七', kana: 'なな', romaji: 'nana', note: 'Trong bảy ngày: 七日 = shichinichi' },
  { kanji: '八', kana: 'はち', romaji: 'hachi' },
  { kanji: '九', kana: 'きゅう', romaji: 'kyuu', note: 'Trong chín ngày: 九日 = kokunichi' },
  { kanji: '十', kana: 'じゅう', romaji: 'juu' },
  { kanji: '百', kana: 'ひゃく', romaji: 'hyaku' },
  { kanji: '千', kana: 'せん', romaji: 'sen' },
  { kanji: '万', kana: 'まん', romaji: 'man' },
];

export const countingRules = [
  { range: '1–10', text: 'Dùng lượng từ riêng: ひとつ、ふたつ、みっつ、よっつ、いつつ、むっつ、ななつ、やっつ、ここのつ' },
  { range: '11 trở lên', text: 'Đọc 十 + số: 11 = じゅういち, 12 = じゅうに, 23 = にじゅうさん' },
  { range: '0', text: 'Không dùng lượng từ. Đọc ゼロ (zero) như một ký hiệu.' },
  { range: 'Lưu ý', text: 'Sau lượng từ, số đọc theo cách riêng. Ví dụ 三人 là sannin chứ không phải さんにん.' },
];

// Chia động từ.
export const verbClasses = {
  ichidan: {
    label: 'Ichidan (一段動詞)',
    rule: 'Bỏ ru ます rồi gắn lại. Quá khứ gắn ました, dạng て gắn て.',
    endings: ['食べます', '食べました', '食べません', '食べませんでした', '食べて', '食べましょう'],
  },
  godan: {
    label: 'Godan (五段動詞)',
    rule: 'Đổi phụ âm cuối theo nhóm rồi gắn suffix.',
    endings: ['書きます', '書きました', '書きません', '書きませんでした', '書いて', '書きましょう'],
  },
  irregular: {
    label: 'Bất quy tắc',
    rule: 'Hai động từ này chia như ichidan nhưng dạng ます lại bất quy tắc.',
    endings: ['します', 'しました', 'しません', 'しませんでした', 'して', 'しましょう'],
  },
};