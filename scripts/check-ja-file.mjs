// Kiem tra 1 file tu vung tieng Nhat rieng le.
// Dung: node scripts/check-ja-file.mjs src/data/ja/vocab/family.js
import { existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkTopic } from '../tests/helpers/checkTopic.js';

const target = process.argv[2];
if (!target) {
  console.error('dung: node scripts/check-ja-file.mjs src/data/ja/vocab/<file>.js');
  process.exit(2);
}
const p = resolve(process.cwd(), target);
if (!existsSync(p)) {
  console.error(`khong tim thay: ${p}`);
  process.exit(2);
}
const expectedId = 'ja-' + basename(p, '.js');
const mod = await import(pathToFileURL(p).href);
const bad = await checkTopic(mod, expectedId);
if (bad.length === 0) {
  console.log(`OK ${basename(p)} (${mod.words.length} tu, level=${mod.topic.level})`);
} else {
  console.error(`LOI ${basename(p)} (${bad.length}):`);
  for (const b of bad) console.error(' -', b);
  process.exit(1);
}
