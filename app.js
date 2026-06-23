// Muat variabel environment dari file .env (PORT, DATABASE_URL, JWT_SECRET, CORS_ORIGIN).
// Di server produksi, nilai-nilai ini diatur lewat environment, bukan hardcode.
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();

// CORS: daftar origin frontend yang diizinkan dibaca dari env CORS_ORIGIN,
// dipisah koma — contoh: "https://situs-kalian.netlify.app,http://localhost:5173".
// Saat deployment, kalian akan menambahkan origin Netlify kalian di sini.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Route tidak dikenal → 404 dengan bentuk error yang konsisten
app.use((req, res) => {
  res.status(404).json({ error: 'route tidak ditemukan' });
});

// Error tak terduga → 500; detail error dicatat ke stdout/stderr
// agar terbaca lewat log PM2 / docker logs.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'terjadi kesalahan pada server' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
// test ci
