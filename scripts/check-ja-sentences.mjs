// Kiểm tra 1 file câu giao tiếpthứ tiếng Nhật (sentences-extra*.js).
// Cách dùng: node scripts/check-ja-sentences.mjs src/data/ja/sentences-extra1.js
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { tokenizeSentence } from '../src/lib/sentenceUtils.js';
import { dailySentences as base } from '../src/data/ja/sentences.js';

const rel = process.argv[2];
if (!rel) {
  console.error('thieu duong dan file');
  process.exit(2);
}

const abs = path.resolve(rel);
let mod;
try {
  mod = await import(pathToFileURL(abs).href);
} catch (e) {
  console.error('khong import duoc:', e.message);
  process.exit(2);
}

const list = mod.dailySentences;
const errs = [];
if (!Array.isArray(list) || list.length === 0) {
  errs.push('export dailySentences phai la mang rong? khong');
}

const seenId = new Set();
const seenEn = new Set(base.map(s => s.en));
const JAP = /[\u3040-\u30ff\u4e00-\u9fff]/;

(Array.isArray(list) ? list : []).forEach((s, i) => {
  const where = `#${s?.id ?? i}`;
  if (!s || typeof s !== 'object') return errs.push(`${where}: khong phai object`);
  if (!Number.isInteger(s.id)) errs.push(`${where}: id khong phai so nguyen`);
  else if (seenId.has(s.id)) errs.push(`${where}: id trung trong file`);
  seenId.add(s.id);

  if (typeof s.en !== 'string' || !s.en.trim()) errs.push(`${where}: en thieu`);
  if (typeof s.vi !== 'string' || !s.vi.trim()) errs.push(`${where}: vi thieu`);
  if (typeof s.pron !== 'string' || !s.pron.trim()) errs.push(`${where}: pron thieu`);
  if (!s.grammar || typeof s.grammar.name !== 'string' || !s.grammar.name ||
      typeof s.grammar.explanation !== 'string' || !s.grammar.explanation) {
    errs.push(`${where}: grammar.name/explanation thieu`);
  }
  if (!Array.isArray(s.breakdown) || s.breakdown.length < 2) {
    errs.push(`${where}: breakdown phai co it nhat 2 muc`);
  } else {
    for (const b of s.breakdown) {
      if (!b?.part || !b?.note) errs.push(`${where}: breakdown thieu part/note`);
    }
  }

  if (s.en) {
    if (!JAP.test(s.en)) errs.push(`${where}: en khong co chu Nhat: ${s.en}`);
    if (/[A-Za-z]/.test(s.en)) errs.push(`${where}: en con chu Latin: ${s.en}`);
    if (/[.,;:!?]/.test(s.en)) errs.push(`${where}: en co dau ASCII cham: ${s.en}`);
    if (seenEn.has(s.en)) errs.push(`${where}: en trung voi cau da co: ${s.en}`);
    seenEn.add(s.en);
    const tokens = tokenizeSentence(s.en, true);
    if (tokens.length < 3) errs.push(`${where}: chi tach duoc ${tokens.length} mot (can >=3): ${s.en}`);
  }
  if (s.pron && !/^[a-z]+(?: [a-z]+)*$/.test(s.pron)) {
    errs.push(`${where}: pron phai chu thuong a-z co khoang trang: ${s.pron}`);
  }
});

if (errs.length) {
  console.error('LOI:');
  for (const e of errs) console.error(' -', e);
  process.exit(1);
}
console.log(`OK ${path.basename(abs)} (${list.length} cau)`);
