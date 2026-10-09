// Tạo bộ từ vựng cá nhân theo chủ đề — chọn từ thông minh trong kho từ hiện có.

export const DECK_THEMES = [
  {
    id: 'interview',
    name: 'Phỏng vấn xin việc',
    icon: '💼',
    desc: 'Từ vựng cho buổi phỏng vấn và hồ sơ nghề nghiệp',
    topics: ['workplace', 'school-work'],
    keywords: ['interview', 'resume', 'career', 'salary', 'skill', 'experience', 'hire', 'employee', 'manager', 'office', 'job', 'work', 'profession'],
  },
  {
    id: 'travel',
    name: 'Du lịch',
    icon: '✈️',
    desc: 'Chuẩn bị hành lý, sân bay, khách sạn và hỏi đường',
    topics: ['travel-daily', 'directions', 'transportation'],
    keywords: ['travel', 'trip', 'hotel', 'airport', 'luggage', 'passport', 'flight', 'journey', 'map', 'station', 'ticket', 'tour'],
  },
  {
    id: 'food',
    name: 'Nhà hàng & ẩm thực',
    icon: '🍜',
    desc: 'Gọi món, nhà hàng và đồ ăn thức uống',
    topics: ['food-drinks', 'shopping'],
    keywords: ['food', 'eat', 'drink', 'restaurant', 'menu', 'cook', 'taste', 'meal', 'dish', 'hungry', 'order', 'recipe'],
  },
  {
    id: 'business',
    name: 'Công sở & email',
    icon: '📧',
    desc: 'Họp hành, email, hợp đồng và quản lý công việc',
    topics: ['workplace', 'phone-internet', 'services'],
    keywords: ['meeting', 'email', 'report', 'client', 'deadline', 'schedule', 'contract', 'message', 'office', 'project'],
  },
  {
    id: 'ielts',
    name: 'Chủ đề IELTS',
    icon: '🌍',
    desc: 'Từ vựng nghị luận: môi trường, xã hội, khoa học',
    topics: ['environment-society', 'news-media', 'science', 'technology-media'],
    keywords: ['environment', 'pollution', 'climate', 'society', 'research', 'energy', 'waste', 'global', 'develop'],
  },
  {
    id: 'daily',
    name: 'Giao tiếp hằng ngày',
    icon: '💬',
    desc: 'Chào hỏi, gia đình, cảm xúc trong hội thoại hằng ngày',
    topics: ['greetings', 'family', 'emotions-personality'],
    keywords: ['hello', 'please', 'thank', 'sorry', 'friend', 'happy', 'feel', 'talk', 'love', 'family'],
  },
  {
    id: 'health',
    name: 'Sức khỏe',
    icon: '💪',
    desc: 'Cơ thể, bác sĩ, thuốc và an toàn',
    topics: ['body-health', 'emergencies'],
    keywords: ['health', 'doctor', 'hospital', 'pain', 'medicine', 'body', 'ill', 'safe', 'emergency', 'treatment'],
  },
  {
    id: 'school',
    name: 'Trường học',
    icon: '🎓',
    desc: 'Lớp học, bài thi và đời sống học sinh – sinh viên',
    topics: ['school-work'],
    keywords: ['student', 'teacher', 'exam', 'class', 'study', 'homework', 'lesson', 'university', 'school', 'grade'],
  },
];

export const getDeckTheme = (id) => DECK_THEMES.find(t => t.id === id) || null;

const DECK_SEP = '#';

export const deckItemKey = (topicId, wordId) => `${topicId}${DECK_SEP}${wordId}`;

export function parseDeckItem(key) {
  const s = String(key);
  const i = s.indexOf(DECK_SEP);
  if (i === -1) return null;
  const wordId = Number(s.slice(i + 1));
  if (!Number.isFinite(wordId)) return null;
  return { topicId: s.slice(0, i), wordId };
}

// Trả về danh sách từ đã gắn topicId, bỏ qua id không còn tồn tại trong dữ liệu.
export function resolveDeckItems(items = [], vocabulary = {}) {
  const out = [];
  for (const raw of items) {
    const parsed = parseDeckItem(raw);
    if (!parsed) continue;
    const word = (vocabulary[parsed.topicId] || []).find(w => w.id === parsed.wordId);
    if (word) out.push({ ...word, topicId: parsed.topicId });
  }
  return out;
}

function scoreWord(word, theme, query) {
  let score = 0;
  const w = String(word.word).toLowerCase();
  const m = String(word.meaning || '').toLowerCase();
  const ex = String(word.example || '').toLowerCase();

  if (theme) {
    if (theme.topics.includes(word.topicId)) score += 2;
    for (const kw of theme.keywords) {
      if (w.includes(kw)) score += 6;
      else if (m.includes(kw) || ex.includes(kw)) score += 4;
    }
  }

  if (query) {
    const q = query.toLowerCase().trim();
    if (q.length >= 2) {
      if (w.startsWith(q)) score += 10;
      else if (w.includes(q)) score += 6;
      else if (m.includes(q)) score += 4;
    }
  }

  return score;
}

// Chọn từ phù hợp nhất với chủ đề / truy vấn. Trả về [{...word, topicId}].
export function suggestWords(allWords, { themeId = null, query = '', limit = 30 } = {}) {
  const theme = themeId ? getDeckTheme(themeId) : null;
  const q = String(query || '').trim();

  const scored = allWords
    .map(word => ({ word, score: scoreWord(word, theme, q) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || String(a.word.word).localeCompare(String(b.word.word)));

  const picked = scored.slice(0, limit).map(x => x.word);

  // Nếu chưa đủ, bổ sung từ thuộc chủ đề của theme (theo thứ tự dữ liệu).
  if (theme && picked.length < limit) {
    const seen = new Set(picked.map(w => `${w.topicId}${DECK_SEP}${w.id}`));
    for (const w of allWords) {
      if (picked.length >= limit) break;
      if (!theme.topics.includes(w.topicId)) continue;
      const key = `${w.topicId}${DECK_SEP}${w.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(w);
    }
  }

  return picked;
}

// Tìm kiếm nhanh toàn bộ kho từ (word / meaning).
export function searchAllWords(allWords, query, limit = 20) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  return allWords
    .filter(w =>
      String(w.word).toLowerCase().includes(q) ||
      String(w.meaning || '').toLowerCase().includes(q)
    )
    .slice(0, limit);
}
