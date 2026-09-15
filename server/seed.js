import { pool, initDb } from './db.js';
import { topics, vocabulary } from '../src/data/vocabulary.js';
import { grammarLessons } from '../src/data/grammar.js';
import { dailySentences } from '../src/data/sentences.js';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM content_sentences');
    await client.query('DELETE FROM content_grammar_cloze');
    await client.query('DELETE FROM content_grammar_practice');
    await client.query('DELETE FROM content_grammar');
    await client.query('DELETE FROM content_words');
    await client.query('DELETE FROM content_topics');

    // topics
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      await client.query(
        'INSERT INTO content_topics (tkey, name, icon, gradient, pos) VALUES ($1,$2,$3,$4,$5)',
        [t.id, t.name, t.icon, t.gradient, i],
      );
    }

    // words
    for (const [topicId, words] of Object.entries(vocabulary)) {
      if (!Array.isArray(words)) continue;
      for (const w of words) {
        await client.query(
          'INSERT INTO content_words (topic, wid, word, pronunciation, meaning, example, type) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [topicId, w.id, w.word, w.pronunciation || '', w.meaning || '', w.example || '', w.type || ''],
        );
      }
    }

    // grammar
    for (let i = 0; i < grammarLessons.length; i++) {
      const g = grammarLessons[i];
      const res = await client.query(
        'INSERT INTO content_grammar (gkey, icon, title, tag, explanation, formula, examples, signals) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
        [
          g.id, g.icon, g.title, g.tag || '',
          g.explanation,
          JSON.stringify(g.formula || []),
          JSON.stringify(g.examples || []),
          JSON.stringify(g.signals || []),
        ],
      );
      const gid = res.rows[0].id;

      for (let j = 0; j < (g.practice || []).length; j++) {
        const p = g.practice[j];
        await client.query(
          'INSERT INTO content_grammar_practice (grammar_id, pos, question, options, answer_index, explanation) VALUES ($1,$2,$3,$4,$5,$6)',
          [gid, j, p.q, JSON.stringify(p.options), p.answerIndex, p.explanation || ''],
        );
      }

      for (let j = 0; j < (g.cloze || []).length; j++) {
        const c = g.cloze[j];
        await client.query(
          'INSERT INTO content_grammar_cloze (grammar_id, pos, sentence, answer, note) VALUES ($1,$2,$3,$4,$5)',
          [gid, j, c.sentence, c.answer, c.note || ''],
        );
      }
    }

    // sentences
    for (const s of dailySentences) {
      await client.query(
        `INSERT INTO content_sentences (skey, en, vi, pron, tag, grammar_name, grammar_explanation, breakdown)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [s.id, s.en, s.vi, s.pron, s.tag, s.grammar?.name || '', s.grammar?.explanation || '', JSON.stringify(s.breakdown || [])],
      );
    }

    await client.query('COMMIT');
    console.log('Seed complete.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', e);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

await initDb();
await seed();