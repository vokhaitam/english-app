// Gói dữ liệu tiếng Nhật.
// Giữ đúng interface của src/data/vocabulary.js để các trang không phải sửa logic.
import * as greetings from './vocab/greetings';
import * as numbersTime from './vocab/numbers-time';
import * as dailyLife from './vocab/daily-life';
import * as food from './vocab/food';
import * as family from './vocab/family';
import * as bodyHealth from './vocab/body-health';
import * as homePlaces from './vocab/home-places';
import * as schoolWork from './vocab/school-work';
import * as shopping from './vocab/shopping';
import * as transportation from './vocab/transportation';
import * as directions from './vocab/directions';
import * as clothesFashion from './vocab/clothes-fashion';
import * as animalsNature from './vocab/animals-nature';
import * as nature from './vocab/nature';
import * as weather from './vocab/weather';
import * as householdItems from './vocab/household-items';
import * as sportsHobbies from './vocab/sports-hobbies';
import * as emotionsPersonality from './vocab/emotions-personality';
import * as phoneInternet from './vocab/phone-internet';
import * as travelDaily from './vocab/travel-daily';
import * as emergencies from './vocab/emergencies';
import * as workplace from './vocab/workplace';
import * as technologyMedia from './vocab/technology-media';
import * as services from './vocab/services';
import * as science from './vocab/science';
import * as environmentSociety from './vocab/environment-society';
import * as newsMedia from './vocab/news-media';
import { grammarLessons as rawLessons } from './grammar';
import { grammarReadings } from './grammarReadings';
import { dailySentences } from './sentences';
import {
  kanaRows, kanaYoOn, kanaSpecial, kanaChart,
  counters, numberWords, countingRules, verbClasses,
} from './kana';

// Thứ tự học: nền tảng (chào hỏi, số, đời sống, ăn uống) -> N5 -> N4 -> N3.
const topicModules = [
  greetings, numbersTime, dailyLife, food,
  family, bodyHealth, homePlaces, schoolWork, shopping,
  transportation, directions, clothesFashion,
  animalsNature, nature, weather, householdItems, sportsHobbies,
  emotionsPersonality, phoneInternet, travelDaily, emergencies, workplace,
  technologyMedia, services, science, environmentSociety, newsMedia,
];

// Trang hiện tại dùng topic.name để hiển thị, nên đặt tên tiếng Việt vào name
// còn kanji/kana đặt vào kana để dùng khi cần.
function normalizeTopic(mod) {
  return {
    id: mod.topic.id,
    name: mod.topic.nameVi,
    kana: mod.topic.name,
    icon: mod.topic.icon,
    color: mod.topic.color,
    gradient: mod.topic.gradient,
    level: mod.topic.level,
  };
}

const levels = [
  { id: 'n5', label: 'N5 — Sơ cấp', icon: '🌱', color: '#66BB6A', desc: 'Bắt đầu từ đầu, gần 800 từ thông dụng' },
  { id: 'n4', label: 'N4 — Sơ trung cấp', icon: '💬', color: '#29B6F6', desc: 'Ngữ pháp và từ vựng dùng hằng ngày' },
  { id: 'n3', label: 'N3 — Trung cấp', icon: '🚀', color: '#F06292', desc: 'Hiểu nội dung đời sống và báo chí đơn giản' },
];

const topics = topicModules.map(normalizeTopic);

const vocabulary = Object.fromEntries(
  topicModules.map(m => [m.topic.id, m.words]),
);

function getAllWords() {
  return topicModules.flatMap(m => m.words.map(w => ({ ...w, topicId: m.topic.id })));
}

// ---- Chuẩn hoá bài ngữ pháp về cùng shape với tiếng Anh ----
const ICONS = ['📘', '✍️', '💬', '🧩', '⚡', '📏', '🛡️', '🔗', '📌', '⏰', '🕑', '🎯', '🧠', '🗣️', '📖'];

const TAG_LABEL = { n5: 'N5', n4: 'N4', n3: 'N3' };

const grammarLessons = rawLessons.map((l, i) => {
  const r = grammarReadings[l.id] || {};
  return {
    id: l.id,
    icon: ICONS[i % ICONS.length],
    title: l.title,
    tag: TAG_LABEL[l.level] || l.level.toUpperCase(),
    explanation: `${l.explain || ''}\n${l.formula ? `\nCông thức:\n${l.formula.join('  /  ')}` : ''}`,
    formula: (l.formula || []).map((f, fi) => ({ text: f, reading: r.formula?.[fi]?.reading || '' })),
    signals: l.signals || null,
    // Kèm phiên âm hiragana để người mới đọc được kanji.
    examples: (l.examples || []).map((e, ei) => ({
      jp: e.jp,
      vi: e.vi,
      reading: r.examples?.[ei]?.reading || '',
    })),
    practice: l.practice || [],
    cloze: l.cloze || null,
    level: l.level,
    order: l.order,
  };
});

// GrammarPracticePage đọc mảng phẳng, nên gộp practice của từng bài lại.
let pid = 1;
const grammarPractice = rawLessons.flatMap(l =>
  (l.practice || []).map(p => ({
    id: pid++,
    topic: l.title,
    q: p.q,
    options: p.options,
    answerIndex: p.answerIndex,
    explanation: p.explanation,
    lessonId: l.id,
  })),
);

export default {
  id: 'ja',
  name: 'Tiếng Nhật',
  nativeName: '日本語',
  flag: '🇯🇵',
  locale: 'ja-JP',
  speechLang: 'ja-JP',
  script: 'japanese',

  levels,
  topics,
  vocabulary,
  getAllWords,

  grammarLessons,
  grammarPractice,
  dailySentences,

  // Bảng kana: dữ liệu đã có sẵn, giờ trả ra cho KanaPage dùng.
  kana: {
    rows: kanaRows,
    chart: kanaChart,
    yoon: kanaYoOn,
    special: kanaSpecial,
    counters,
    numberWords,
    countingRules,
    verbClasses,
  },

  unitWord: 'từ vựng',
  unitTopic: 'chủ đề',
  searchPlaceholder: '🔍 Tìm từ vựng (tiếng Nhật hoặc tiếng Việt)...',
  otherLanguageHint: 'tiếng Nhật hoặc tiếng Việt',
  dirFromSource: 'ja2vi',
  dirToSource: 'vi2ja',
  dirLabelFrom: '🇯🇵 → 🇻🇳',
  dirLabelTo: '🇻🇳 → 🇯🇵',
};