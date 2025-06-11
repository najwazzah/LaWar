const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

// Koneksi ke database MySQL
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lawar_db'
});

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // simpan ke folder uploads
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
router.post('/lapor', upload.single('lampiran'), (req, res) => {
  const { judul, detail, instansi, jenis } = req.body;
  const lampiran = req.file ? req.file.filename : null;
  // Jika ada sistem login, bisa ambil userId dari req.session.userId
  // const userId = req.session.userId || null;

  const sql = `
    INSERT INTO pengaduan (judul, detail, instansi, jenis, lampiran)
    VALUES (?, ?, ?, ?, ?)
  `;
  con.query(sql, [judul, detail, instansi, jenis, lampiran], (err, result) => {
    if (err) {
      console.error('Gagal mengirim laporan:', err);
      return res.status(500).send('Terjadi kesalahan saat mengirim laporan.');
    }
    res.redirect('/dashboard/warga');
  });
});

module.exports = router;
