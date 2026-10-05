import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { languages, getLanguage, defaultLanguage } from '../data/registry';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'appLanguage';

function loadLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages.some(l => l.id === saved)) return saved;
  } catch { /* localStorage chưa sẵn sàng thì dùng mặc định */ }
  return defaultLanguage;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLanguage);

  const selectLanguage = useCallback(next => {
    setLang(prev => {
      const value = languages.some(l => l.id === next) ? next : prev;
      try { localStorage.setItem(STORAGE_KEY, value); } catch { /* bỏ qua */ }
      return value;
    });
  }, []);

  const value = useMemo(() => {
    const pack = getLanguage(lang);
    return {
      lang,
      pack,
      languages,
      selectLanguage,
      isJapanese: pack.id === 'ja',
      // Tiện ích: các trang lấy dữ liệu qua pack thay vì import trực tiếp.
      topics: pack.topics,
      vocabulary: pack.vocabulary,
      levels: pack.levels,
      getAllWords: pack.getAllWords,
      grammarLessons: pack.grammarLessons,
      grammarPractice: pack.grammarPractice,
      dailySentences: pack.dailySentences,
    };
  }, [lang, selectLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components -- Provider + hook cùng module để dùng chung context
export const useLanguage = () => useContext(LanguageContext);