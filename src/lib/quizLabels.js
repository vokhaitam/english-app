// Nhãn nguồn của một lượt quiz/game để hiển thị trong lịch sử & thống kê.

export const GAME_LABELS = {
  'game:memory-match': 'Ghép thẻ',
  'game:word-scramble': 'Xếp chữ',
  'game:listening-challenge': 'Thử thách nghe',
  'game:sentence-builder': 'Xếp câu',
};

export function getQuizSource(topicId, topics = [], customDecks = {}) {
  if (typeof topicId === 'string' && topicId.startsWith('deck:')) {
    const deck = customDecks[topicId.slice(5)];
    return deck
      ? { icon: deck.icon || '🗂️', label: deck.name }
      : { icon: '🗂️', label: 'Bộ từ đã xóa' };
  }
  if (typeof topicId === 'string' && topicId.startsWith('game:')) {
    return { icon: '🎮', label: GAME_LABELS[topicId] || 'Game' };
  }
  if (topicId === 'grammar') return { icon: '✍️', label: 'Ngữ pháp' };
  if (topicId === 'all') return { icon: '🎲', label: 'Trộn tất cả' };
  const topic = topics.find(t => t.id === topicId);
  return topic
    ? { icon: topic.icon, label: topic.name }
    : { icon: '🎯', label: 'Quiz' };
}
