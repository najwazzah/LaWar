const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lawar_db'
});

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (fs.existsSync(uploadDir) && fs.statSync(uploadDir).isFile()) {
  fs.unlinkSync(uploadDir);
}
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  const successMessage = req.session && req.session.successMessage ? req.session.successMessage : null;
  if (req.session && req.session.successMessage) delete req.session.successMessage;

  res.render('warga', {
    partial: null,
    data: [],
    successMessage: successMessage || null,
    user: req.session && req.session.user ? req.session.user : null
  });
});

router.post('/lapor', upload.single('lampiran'), (req, res) => {
  const { judul, detail, instansi, jenis } = req.body;
  const normalizedJenis = {
    Kerusakan: 'kerusakan',
    Keamanan: 'Keamanan',
    Lingkungan: 'Lingkungan'
  }[jenis] || jenis;
  const lampiran = req.file ? req.file.filename : null;

  if (!judul || !detail || !instansi || !jenis) {
    return res.status(400).send('Semua field wajib diisi.');
  }

  con.query(
    'INSERT INTO pengaduan (judul, detail, instansi, jenis, lampiran) VALUES (?, ?, ?, ?, ?)',
    [judul, detail, instansi, normalizedJenis, lampiran],
    (err, result) => {
      if (err) {
        console.error('Gagal mengirim laporan:', err);
        return res.status(500).send('Terjadi kesalahan saat mengirim laporan.');
      }

      req.session.successMessage = 'Laporan Anda berhasil terkirim!';
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).send('Terjadi kesalahan saat menyimpan notifikasi.');
        }
        res.redirect('/dashboard/warga?success=1');
      });
    }
  );
});

module.exports = router;
