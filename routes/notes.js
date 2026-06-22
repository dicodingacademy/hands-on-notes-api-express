const express = require('express');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');
const { validateNote } = require('../validators/validators');

const router = express.Router();

// Semua route catatan wajib login — middleware authenticate mengisi req.userId.
router.use(authenticate);

// GET /api/notes — daftar catatan milik user yang sedang login
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, body, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId]
  );
  res.json({ data: rows });
});

// POST /api/notes — membuat catatan baru
router.post('/', async (req, res) => {
  const result = validateNote(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const { rows } = await pool.query(
    'INSERT INTO notes (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, body, created_at',
    [req.userId, req.body.title.trim(), req.body.body || '']
  );
  res.status(201).json({ data: rows[0] });
});

// GET /api/notes/:id — detail satu catatan milik user
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: 'catatan tidak ditemukan' });
  }

  const { rows } = await pool.query(
    'SELECT id, title, body, created_at FROM notes WHERE id = $1 AND user_id = $2',
    [id, req.userId]
  );

  // Catatan milik user lain juga menghasilkan 404 (bukan 403)
  // agar tidak membocorkan keberadaan resource.
  if (rows.length === 0) {
    return res.status(404).json({ error: 'catatan tidak ditemukan' });
  }
  res.json({ data: rows[0] });
});

// DELETE /api/notes/:id — menghapus catatan milik user
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: 'catatan tidak ditemukan' });
  }

  const { rows } = await pool.query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, req.userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'catatan tidak ditemukan' });
  }
  res.json({ data: { id: rows[0].id } });
});

module.exports = router;
