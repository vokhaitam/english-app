import { describe, it, expect } from 'vitest';
import { todayKey, localDateKey, getWeekHistory, getStreakDays } from '../src/lib/dateHelpers';

describe('todayKey', () => {
  it('returns a YYYY-MM-DD key', () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('is stable within the same day', () => {
    expect(todayKey()).toBe(todayKey());
  });
});

describe('localDateKey', () => {
  it('produces the local date for a given Date', () => {
    // 2026-09-15 12:00 local
    const d = new Date(2026, 8, 15, 12, 0, 0);
    expect(localDateKey(d)).toBe('2026-09-15');
  });

  it('handles a near-midnight local time', () => {
    const d = new Date(2026, 8, 15, 23, 30, 0);
    expect(localDateKey(d)).toBe('2026-09-15');
  });
});

describe('getWeekHistory', () => {
  it('returns 7 entries ending today', () => {
    const now = new Date(2026, 8, 15, 12, 0, 0);
    const history = getWeekHistory({}, now);
    expect(history.length).toBe(7);
    // Last entry corresponds to now's local day
    expect(history[6].count).toBe(0);
    // All days are consecutive
    const keys = history.map(h => localDateKey(new Date(now.getTime() - (6 - history.indexOf(h)) * 86400000)));
    expect(keys.length).toBe(7);
  });

  it('reads counts from dailyProgress keyed by local date', () => {
    const now = new Date(2026, 8, 15, 12, 0, 0);
    const today = '2026-09-15';
    const history = getWeekHistory({ [today]: 5 }, now);
    expect(history[6].count).toBe(5);
  });
});

describe('getStreakDays', () => {
  it('returns 0 when never studied or last study is old', () => {
    expect(getStreakDays(null, new Date(2026, 8, 15))).toBe(0);
    expect(getStreakDays('2026-09-10', new Date(2026, 8, 15))).toBe(0);
  });

  it('returns 1 when last study was yesterday', () => {
    const now = new Date(2026, 8, 15, 9, 0, 0);
    expect(getStreakDays('2026-09-14', now)).toBe(1);
  });
});