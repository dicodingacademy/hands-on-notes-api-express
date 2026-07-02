const express = require('express');
const multer = require('multer');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Gambar ditampung di memori (bukan disk) karena langsung diteruskan ke layanan AI.
const upload = multer({ storage: multer.memoryStorage() });

// URL layanan AI eksternal dibaca dari environment (AI_SERVICE_URL),
// sama seperti konfigurasi lain — tidak pernah di-hardcode.
const AI_URL = process.env.AI_SERVICE_URL;

// POST /api/predict — terima gambar, teruskan ke layanan AI, simpan hasil, kembalikan ke FE.
// Wajib login: middleware authenticate mengisi req.userId.
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'file gambar wajib disertakan' });
  }

  // 1. Teruskan gambar ke layanan AI.
  // Pakai FormData + Blob bawaan Node (bukan paket form-data) agar dikenali fetch native:
  // fetch mengisi sendiri Content-Type multipart/form-data beserta boundary-nya.
  const formData = new FormData();
  const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
  formData.append('file', fileBlob, req.file.originalname);

  let predictions;
  try {
    const aiResponse = await fetch(`${AI_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.json().catch(() => ({}));
      return res.status(502).json({ error: err.detail || 'layanan AI tidak merespons' });
    }

    const aiData = await aiResponse.json();
    predictions = aiData.predictions;
  } catch (err) {
    return res.status(502).json({ error: 'gagal menghubungi layanan AI' });
  }

  // 2. Simpan hasil ke database (kegagalan simpan tidak membatalkan respons ke FE)
  const topResult = predictions[0];
  try {
    await pool.query(
      `INSERT INTO classifications
         (user_id, image_name, top_label, top_confidence, all_predictions)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.userId,
        req.file.originalname,
        topResult.label,
        topResult.confidence,
        JSON.stringify(predictions),
      ]
    );
  } catch (err) {
    console.error('Gagal menyimpan hasil klasifikasi ke database.', err);
  }

  // 3. Kembalikan hasil ke Front-End
  res.json({ data: { predictions } });
});

module.exports = router;
