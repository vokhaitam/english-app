// Gói dữ liệu tiếng Anh. Giữ nguyên nội dung cũ, chỉ bọc lại cho khớp interface đa ngôn ngữ.
import { levels, topics, vocabulary, getAllWords } from '../vocabulary';
import { grammarLessons } from '../grammar';
import { grammarPractice } from '../practice';
import { dailySentences } from '../sentences';

export default {
  id: 'en',
  name: 'Tiếng Anh',
  nativeName: 'English',
  flag: '🇬🇧',
  locale: 'en-US',
  speechLang: 'en-US',
  script: 'latin',

  levels,
  topics,
  vocabulary,
  getAllWords,

  grammarLessons,
  grammarPractice,
  dailySentences,

  unitWord: 'từ vựng',
  unitTopic: 'chủ đề',
  searchPlaceholder: '🔍 Tìm từ vựng (tiếng Anh hoặc tiếng Việt)...',
  otherLanguageHint: 'tiếng Anh hoặc tiếng Việt',
  dirFromSource: 'en2vi',
  dirToSource: 'vi2en',
  dirLabelFrom: '🇬🇧 → 🇻🇳',
  dirLabelTo: '🇻🇳 → 🇬🇧',
};