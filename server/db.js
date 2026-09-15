import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '12112006',
  database: process.env.PGDATABASE || 'english_app',
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_topics (
      id       serial PRIMARY KEY,
      tkey     text NOT NULL UNIQUE,
      name     text NOT NULL,
      icon     text NOT NULL DEFAULT '',
      gradient text NOT NULL DEFAULT '',
      pos      int  NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS content_words (
      id            serial PRIMARY KEY,
      topic         text NOT NULL,
      wid           int  NOT NULL,
      word          text NOT NULL,
      pronunciation text NOT NULL DEFAULT '',
      meaning       text NOT NULL DEFAULT '',
      example       text NOT NULL DEFAULT '',
      type          text NOT NULL DEFAULT '',
      UNIQUE (topic, wid)
    );

    CREATE TABLE IF NOT EXISTS content_grammar (
      id       serial PRIMARY KEY,
      gkey     text NOT NULL UNIQUE,
      icon     text NOT NULL DEFAULT '',
      title    text NOT NULL,
      tag      text NOT NULL DEFAULT '',
      explanation text NOT NULL DEFAULT '',
      formula  jsonb NOT NULL DEFAULT '[]',
      examples jsonb NOT NULL DEFAULT '[]',
      signals  jsonb NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS content_grammar_practice (
      id           serial PRIMARY KEY,
      grammar_id   int  NOT NULL REFERENCES content_grammar(id) ON DELETE CASCADE,
      pos          int  NOT NULL DEFAULT 0,
      question     text NOT NULL,
      options      jsonb NOT NULL,
      answer_index int  NOT NULL,
      explanation  text NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS content_grammar_cloze (
      id         serial PRIMARY KEY,
      grammar_id int  NOT NULL REFERENCES content_grammar(id) ON DELETE CASCADE,
      pos        int  NOT NULL DEFAULT 0,
      sentence   text NOT NULL,
      answer     text NOT NULL,
      note       text NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS content_sentences (
      id       serial PRIMARY KEY,
      skey     int  NOT NULL UNIQUE,
      en       text NOT NULL,
      vi       text NOT NULL DEFAULT '',
      pron     text NOT NULL DEFAULT '',
      tag      text NOT NULL DEFAULT '',
      grammar_name        text NOT NULL DEFAULT '',
      grammar_explanation text NOT NULL DEFAULT '',
      breakdown jsonb NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS app_state (
      id         int PRIMARY KEY DEFAULT 1,
      data       jsonb NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}