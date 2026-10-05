import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { todayKey, getWeekHistory as getWeekHistoryData } from '../lib/dateHelpers';
import { wordKey, topicKey, wordKeyLang, migrateLegacyObject } from '../lib/wordKey';
import { useLanguage } from './LanguageContext';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const AppContext = createContext(null);

const REVIEW_INTERVALS = [0, 10 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 21 * 24 * 60 * 60 * 1000];
const MAX_LEVEL = REVIEW_INTERVALS.length - 1;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const { lang } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  // Khoá cũ chưa có namespace thì mặc định là tiếng Anh.
  const [knownWords, setKnownWords] = useState(() => migrateLegacyObject(load('knownWords', {})));
  const [starredWords, setStarredWords] = useState(() => migrateLegacyObject(load('starredWords', {})));
  const [reviewItems, setReviewItems] = useState(() => migrateLegacyObject(load('reviewItems', {})));
  const [mistakes, setMistakes] = useState(() => migrateLegacyObject(load('mistakes', {})));
  const [studyHistory, setStudyHistory] = useState(() => load('studyHistory', []));
  const [quizScores, setQuizScores] = useState(() => load('quizScores', []));
  const [streakDays, setStreakDays] = useState(() => parseInt(localStorage.getItem('streakDays') || '0', 10));
  const [lastStudyDate, setLastStudyDate] = useState(() => localStorage.getItem('lastStudyDate') || null);
  const [dailyGoal, setDailyGoal] = useState(() => parseInt(localStorage.getItem('dailyGoal') || '20', 10));
  const [dailyProgress, setDailyProgress] = useState(() => load('dailyProgress', {}));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp') || '0', 10));
  const [sentencesLearned, setSentencesLearned] = useState(() => load('sentencesLearned', {}));

  const loadedRef = useRef(false);
  const settersRef = useRef({
    theme: setTheme, knownWords: setKnownWords, starredWords: setStarredWords,
    reviewItems: setReviewItems, mistakes: setMistakes, studyHistory: setStudyHistory,
    quizScores: setQuizScores, streakDays: setStreakDays, lastStudyDate: setLastStudyDate,
    dailyGoal: setDailyGoal, dailyProgress: setDailyProgress, xp: setXp,
    sentencesLearned: setSentencesLearned,
  });

  // snapshot helper
  const snapshot = useCallback(() => {
    const s = {};
    s.theme = theme; s.knownWords = knownWords; s.starredWords = starredWords;
    s.reviewItems = reviewItems; s.mistakes = mistakes; s.studyHistory = studyHistory;
    s.quizScores = quizScores; s.streakDays = streakDays; s.lastStudyDate = lastStudyDate;
    s.dailyGoal = dailyGoal; s.dailyProgress = dailyProgress; s.xp = xp;
    s.sentencesLearned = sentencesLearned;
    return s;
  }, [theme, knownWords, starredWords, reviewItems, mistakes, studyHistory, quizScores, streakDays, lastStudyDate, dailyGoal, dailyProgress, xp, sentencesLearned]);

  // load from API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/state`);
        if (r.ok) {
          const data = await r.json();
          if (!cancelled && data && typeof data === 'object') {
            Object.keys(data).forEach(k => {
              if (settersRef.current[k]) settersRef.current[k](data[k]);
            });
          }
        }
      } catch { /* fallback: already loaded from localStorage */ }
      loadedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Persist (localStorage + API) ----
  useEffect(() => { localStorage.setItem('knownWords', JSON.stringify(knownWords)); }, [knownWords]);
  useEffect(() => { localStorage.setItem('starredWords', JSON.stringify(starredWords)); }, [starredWords]);
  useEffect(() => { localStorage.setItem('reviewItems', JSON.stringify(reviewItems)); }, [reviewItems]);
  useEffect(() => { localStorage.setItem('mistakes', JSON.stringify(mistakes)); }, [mistakes]);
  useEffect(() => { localStorage.setItem('studyHistory', JSON.stringify(studyHistory)); }, [studyHistory]);
  useEffect(() => { localStorage.setItem('quizScores', JSON.stringify(quizScores)); }, [quizScores]);
  useEffect(() => { localStorage.setItem('streakDays', String(streakDays)); }, [streakDays]);
  useEffect(() => { if (lastStudyDate) localStorage.setItem('lastStudyDate', lastStudyDate); }, [lastStudyDate]);
  useEffect(() => { localStorage.setItem('dailyGoal', String(dailyGoal)); }, [dailyGoal]);
  useEffect(() => { localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress)); }, [dailyProgress]);
  useEffect(() => { localStorage.setItem('xp', String(xp)); }, [xp]);
  useEffect(() => { localStorage.setItem('sentencesLearned', JSON.stringify(sentencesLearned)); }, [sentencesLearned]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // debounced API sync
  useEffect(() => {
    if (!loadedRef.current) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot()),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [snapshot]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastStudyDate === yesterday) setStreakDays(s => s + 1);
      else setStreakDays(1);
      setLastStudyDate(today);
    }
  };

  const bumpDaily = (n = 1) => {
    const d = todayKey();
    setDailyProgress(prev => ({ ...prev, [d]: (prev[d] || 0) + n }));
  };

  const markKnown = (topicId, wordId, { silent = false } = {}) => {
    const tKey = topicKey(lang, topicId);
    setKnownWords(prev => {
      const list = prev[tKey] || [];
      if (list.includes(wordId)) return prev;
      return { ...prev, [tKey]: [...list, wordId] };
    });
    if (!silent) {
      setXp(x => x + 5);
      bumpDaily();
      updateStreak();
    }
  };

  const markUnknown = (topicId, wordId) => {
    const key = wordKey(lang, topicId, wordId);
    setMistakes(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    setReviewItems(prev => ({ ...prev, [key]: { level: 0, dueAt: Date.now() + REVIEW_INTERVALS[0] } }));
  };

  // Ôn tập đúng thẻ vừa trả lời: đã nhớ thì xoá khỏi hàng chờ và tăng XP,
  // chưa nhớ thì đưa lại vào hàng chờ với khoảng cách ngắn nhất.
  const reviewCard = (topicId, wordId, known) => {
    const key = wordKey(lang, topicId, wordId);
    if (known) {
      setXp(x => x + 3);
      bumpDaily();
      setReviewItems(prev => {
        const existing = prev[key];
        if (!existing) return prev;
        const nextLevel = Math.min(existing.level + 1, MAX_LEVEL);
        if (nextLevel >= MAX_LEVEL) {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        }
        return { ...prev, [key]: { level: nextLevel, dueAt: Date.now() + REVIEW_INTERVALS[nextLevel] } };
      });
    } else {
      setMistakes(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
      setReviewItems(prev => ({ ...prev, [key]: { level: 0, dueAt: Date.now() + REVIEW_INTERVALS[0] } }));
    }
  };

  const isKnown = (topicId, wordId) => (knownWords[topicKey(lang, topicId)] || []).includes(wordId);
  const getTopicProgress = (topicId) => (knownWords[topicKey(lang, topicId)] || []).length;
  const getTotalKnown = () =>
    Object.entries(knownWords)
      .filter(([k]) => wordKeyLang(k) === lang || !k.includes(':'))
      .reduce((a, [, v]) => a + v.length, 0);

  // Chỉ lấy thẻ đến hạn của ngôn ngữ đang học.
  const getDueReviews = useCallback(
    () =>
      Object.entries(reviewItems)
        .filter(([key, v]) => (wordKeyLang(key) || 'en') === lang && v.dueAt <= Date.now())
        .map(([key, v]) => ({ key, ...v })),
    [reviewItems, lang],
  );

  const getReviewCount = () => getDueReviews().length;
  const getTotalInReview = () =>
    Object.keys(reviewItems).filter(k => (wordKeyLang(k) || 'en') === lang).length;

  const toggleStar = (wordKey) => {
    setStarredWords(prev => {
      const copy = { ...prev };
      if (copy[wordKey]) delete copy[wordKey];
      else copy[wordKey] = true;
      return copy;
    });
  };
  const isStarred = (wordKey) => !!starredWords[wordKey];
  const getTotalStarred = () => Object.keys(starredWords).length;

  const addQuizScore = (score, total, topicId) => {
    setQuizScores(prev => [
      { score, total, topicId, date: new Date().toISOString() },
      ...prev.slice(0, 49),
    ]);
    setXp(x => x + score * 2);
    updateStreak();
    bumpDaily();
  };

  const getAvgQuizScore = () => {
    if (quizScores.length === 0) return 0;
    const slice = quizScores.slice(0, 5);
    const avg = slice.reduce((a, b) => a + (b.score / b.total), 0) / slice.length;
    return Math.round(avg * 100);
  };

  const getBestQuizScore = () => {
    if (quizScores.length === 0) return 0;
    return Math.max(...quizScores.map(q => Math.round((q.score / q.total) * 100)));
  };

  const getTodayCount = () => dailyProgress[todayKey()] || 0;

  const getWeekHistory = () => {
    return getWeekHistoryData(dailyProgress);
  };

  const getLevel = () => Math.floor(xp / 100) + 1;
  const getLevelProgress = () => xp % 100;

  const getTopMistakes = () =>
    Object.entries(mistakes)
      .filter(([k]) => (wordKeyLang(k) || 'en') === lang)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([key, count]) => ({ key, count }));

  const toggleSentenceLearned = (id) => {
    setSentencesLearned(prev => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      theme, knownWords, starredWords, reviewItems, mistakes,
      studyHistory, quizScores, streakDays, lastStudyDate,
      dailyGoal, dailyProgress, xp, sentencesLearned,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordflow-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (json) => {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      if (data.knownWords) setKnownWords(data.knownWords);
      if (data.starredWords) setStarredWords(data.starredWords);
      if (data.reviewItems) setReviewItems(data.reviewItems);
      if (data.mistakes) setMistakes(data.mistakes);
      if (data.studyHistory) setStudyHistory(data.studyHistory);
      if (data.quizScores) setQuizScores(data.quizScores);
      if (typeof data.streakDays === 'number') setStreakDays(data.streakDays);
      if (data.lastStudyDate) setLastStudyDate(data.lastStudyDate);
      if (typeof data.dailyGoal === 'number') setDailyGoal(data.dailyGoal);
      if (data.dailyProgress) setDailyProgress(data.dailyProgress);
      if (typeof data.xp === 'number') setXp(data.xp);
      if (data.sentencesLearned) setSentencesLearned(data.sentencesLearned);
      return true;
    } catch {
      return false;
    }
  };

  const resetProgress = () => {
    setKnownWords({});
    setStarredWords({});
    setReviewItems({});
    setMistakes({});
    setStudyHistory([]);
    setQuizScores([]);
    setStreakDays(0);
    setLastStudyDate(null);
    setDailyProgress({});
    setXp(0);
    setSentencesLearned({});
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      knownWords, starredWords, reviewItems, mistakes,
      studyHistory, quizScores, streakDays, dailyGoal, setDailyGoal,
      dailyProgress, xp, sentencesLearned, toggleSentenceLearned,
      markKnown, markUnknown, reviewCard, isKnown, isStarred, toggleStar,
      getTopicProgress, getTotalKnown, getDueReviews, getReviewCount, getTotalInReview,
      addQuizScore, getTotalStarred, getAvgQuizScore, getBestQuizScore,
      getTodayCount, getWeekHistory, getLevel, getLevelProgress,
      getTopMistakes, exportData, importData, resetProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components -- Provider + hook cùng module để dùng chung context
export const useApp = () => useContext(AppContext);