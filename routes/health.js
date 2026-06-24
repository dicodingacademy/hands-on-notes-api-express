const express = require('express');

const router = express.Router();

// Endpoint publik untuk memverifikasi server hidup —
// dipakai saat cek deployment (EC2, NGINX, Docker). Jangan diproteksi auth.
router.get('/', (req, res) => {
  res.json({ status: 'ok from express', version: '1.0' });
});

module.exports = router;
