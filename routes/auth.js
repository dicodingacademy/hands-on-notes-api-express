const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { validateRegister, validateLogin } = require('../validators/validators');

const router = express.Router();

// POST /api/auth/register — mendaftarkan user baru
router.post('/register', async (req, res) => {
  const result = validateRegister(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const username = req.body.username.trim();
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  try {
    const { rows } = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    // Kode 23505 = pelanggaran constraint UNIQUE di PostgreSQL
    if (err.code === '23505') {
      return res.status(400).json({ error: 'username sudah digunakan' });
    }
    throw err;
  }
});

// POST /api/auth/login — menukar username+password dengan access token
router.post('/login', async (req, res) => {
  const result = validateLogin(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const username = req.body.username.trim();
  const { rows } = await pool.query(
    'SELECT id, password FROM users WHERE username = $1',
    [username]
  );

  const user = rows[0];
  const passwordMatch = user && (await bcrypt.compare(req.body.password, user.password));
  if (!passwordMatch) {
    return res.status(400).json({ error: 'username atau password salah' });
  }

  // Access token tunggal berisi { sub: userId }, berlaku 24 jam.
  // JWT_SECRET dibaca dari environment — di produksi disimpan sebagai secret.
  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({ data: { accessToken } });
});

module.exports = router;
