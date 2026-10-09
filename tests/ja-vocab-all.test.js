import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, dirname, basename } from 'node:path';
import { checkTopic } from './helpers/checkTopic';

const vocabDir = join(dirname(fileURLToPath(import.meta.url)), '../src/data/ja/vocab');
const files = readdirSync(vocabDir).filter(f => f.endsWith('.js')).sort();

// Quét mọi file từ vựng JA trên đĩa — kể cả file chưa đăng ký vào pack.
describe('mọi file từ vựng tiếng Nhật trên đĩa', () => {
  it.each(files)('%s đạt chuẩn dữ liệu', async (f) => {
    const mod = await import(pathToFileURL(join(vocabDir, f)).href);
    expect(await checkTopic(mod, 'ja-' + basename(f, '.js'))).toEqual([]);
  });

  it('mỗi file có level hợp lệ và đủ ít nhất 40 từ', async () => {
    for (const f of files) {
      const mod = await import(pathToFileURL(join(vocabDir, f)).href);
      expect(['n5', 'n4', 'n3'], f).toContain(mod.topic.level);
      expect(mod.words.length, f).toBeGreaterThanOrEqual(40);
      expect(mod.topic.icon, f).toBeTruthy();
      expect(mod.topic.color, f).toBeTruthy();
      expect(mod.topic.gradient, f).toMatch(/^linear-gradient/);
    }
  });

  it('id file và id topic khớp nhau, không trùng id giữa các file', async () => {
    const ids = [];
    for (const f of files) {
      const mod = await import(pathToFileURL(join(vocabDir, f)).href);
      expect(mod.topic.id, f).toBe('ja-' + basename(f, '.js'));
      ids.push(mod.topic.id);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });
});
