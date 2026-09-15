// Pure date/streak helpers — testable, no React/DOM dependencies.

export function todayKey() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function localDateKey(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function getWeekHistory(dailyProgress = {}, now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86400000);
    return {
      label: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      count: dailyProgress[localDateKey(d)] || 0,
    };
  });
}

export function getStreakDays(lastStudyDate, now = new Date()) {
  if (!lastStudyDate) return 0;
  const last = new Date(lastStudyDate).toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  if (last === yesterday) return 1;
  return 0;
}