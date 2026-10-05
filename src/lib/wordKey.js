// Khoá tiến trình theo ngôn ngữ: `${lang}:${topicId}-${wordId}`
// Cần namespace vì topicId giống nhau có thể tồn tại ở cả tiếng Anh và tiếng Nhật.

import { EN } from './langUtils';

export const wordKey = (lang, topicId, wordId) => `${lang}:${topicId}-${wordId}`;

export const topicKey = (lang, topicId) => `${lang}:${topicId}`;

export function splitWordKey(key) {
  const i = String(key).indexOf(':');
  if (i === -1) return null;
  const lang = key.slice(0, i);
  const rest = key.slice(i + 1);
  const j = rest.lastIndexOf('-');
  if (j === -1) return null;
  return {
    lang,
    topicId: rest.slice(0, j),
    wordId: rest.slice(j + 1),
  };
}

export function wordKeyLang(key) {
  const i = String(key).indexOf(':');
  return i === -1 ? null : key.slice(0, i);
}

const NAMESPACE_RE = /^[a-z]{2}:/;

// Tiến trình cũ (trước khi có đa ngôn ngữ) dùng khoá trần không có namespace.
// Chuyển toàn bộ sang namespace 'en' để không mất dữ liệu người dùng.
export function migrateLegacyObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const keys = Object.keys(obj);
  if (keys.length === 0) return obj;
  if (keys.every(k => NAMESPACE_RE.test(k))) return obj;
  const out = {};
  for (const k of keys) {
    out[NAMESPACE_RE.test(k) ? k : `${EN}:${k}`] = obj[k];
  }
  return out;
}