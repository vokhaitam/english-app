// Danh sách ngôn ngữ của ứng dụng. Thêm ngôn ngữ mới chỉ cần khai báo ở đây.
import en from './en';
import ja from './ja';

export const languages = [en, ja];

export const defaultLanguage = en.id;

const byId = new Map(languages.map(l => [l.id, l]));

export function getLanguage(id) {
  return byId.get(id) || byId.get(defaultLanguage);
}

export function languageIds() {
  return languages.map(l => l.id);
}