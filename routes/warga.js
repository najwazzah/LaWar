const express = require('express');
const router = express.Router();
const Laporan = require('../models/laporan');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // simpan ke folder public/uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // nama file unik
  }
});

const upload = multer({ storage: storage });

// GET: Form laporan warga
router.get('/', (req, res) => {
  res.render('warga');
});

// POST: Kirim laporan warga
router.post('/lapor', upload.single('lampiran'), async (req, res) => {
  try {
    const { judul, detail, instansi, jenis } = req.body;
    const lampiran = req.file ? req.file.filename : null;

    await Laporan.create({
      nama: 'Anonim', // atau ganti dengan req.session.nama jika pakai sistem login nama warga
      judul,
      detail,
      instansi,
      jenis,
      lampiran
    });

    res.redirect('/dashboard/warga');
  } catch (error) {
    console.error('Gagal mengirim laporan:', error);
    res.status(500).send('Terjadi kesalahan saat mengirim laporan.');
  }
});

module.exports = router;
