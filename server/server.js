import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool, initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// get state
app.get('/api/state', async (_req, res) => {
  const r = await pool.query('SELECT data FROM app_state WHERE id = 1');
  res.json(r.rows[0]?.data || {});
});

// save state (full snapshot)
app.post('/api/state', async (req, res) => {
  await pool.query(
    `INSERT INTO app_state (id, data, updated_at)
       VALUES (1, $1, now())
     ON CONFLICT (id)
       DO UPDATE SET data = $1, updated_at = now()`,
    [JSON.stringify(req.body || {})],
  );
  res.json({ ok: true });
});

// serve production build if it exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '7d', index: false }));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = 3001;

await initDb();
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));