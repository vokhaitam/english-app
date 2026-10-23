import * as greetings from './vocab/greetings';
import * as numbersTime from './vocab/numbers-time';
import * as family from './vocab/family';
import * as food from './vocab/food';
import * as dailyLife from './vocab/daily-life';
import * as bodyHealth from './vocab/body-health';
import * as homePlaces from './vocab/home-places';
import * as shopping from './vocab/shopping';
import * as transportation from './vocab/transportation';

const topicModules = [greetings, numbersTime, family, food, dailyLife, bodyHealth, homePlaces, shopping, transportation];

function normalizeTopic(mod) {
  return {
    id: mod.topic.id,
    name: mod.topic.nameVi || mod.topic.name,
    kana: mod.topic.name,
    icon: mod.topic.icon,
    color: mod.topic.color,
    gradient: mod.topic.gradient,
    level: mod.topic.level,
  };
}

const levels = [
  { id: 'basic', label: 'Cơ bản', icon: '🌱', color: '#66BB6A', desc: 'Những từ vựng thiết yếu nhất' },
  { id: 'communication', label: 'Giao tiếp', icon: '💬', color: '#29B6F6', desc: 'Từ vựng dùng trong đời sống hằng ngày' },
  { id: 'advanced', label: 'Nâng cao', icon: '🚀', color: '#F06292', desc: 'Từ vựng nâng cao hơn' },
];

const topics = topicModules.map(normalizeTopic);
const vocabulary = Object.fromEntries(topicModules.map(m => [m.topic.id, m.words]));

function getAllWords() {
  return topicModules.flatMap(m => m.words.map(w => ({ ...w, topicId: m.topic.id })));
}

export default {
  id: 'zh-tw',
  name: 'Tiếng Trung Phồn thể',
  nativeName: '繁體中文',
  flag: '🇹🇼',
  locale: 'zh-TW',
  speechLang: 'zh-TW',
  script: 'chinese',

  levels,
  topics,
  vocabulary,
  getAllWords,

  grammarLessons: [],
  grammarPractice: [],
  dailySentences: [],

  unitWord: 'từ vựng',
  unitTopic: 'chủ đề',
  searchPlaceholder: '🔍 Tìm từ vựng (tiếng Trung hoặc tiếng Việt)...',
  otherLanguageHint: 'tiếng Trung hoặc tiếng Việt',
  dirFromSource: 'zh2vi',
  dirToSource: 'vi2zh',
  dirLabelFrom: '🇹🇼 → 🇻🇳',
  dirLabelTo: '🇻🇳 → 🇹🇼',
};
