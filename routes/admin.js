const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Koneksi ke database MySQL
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lawar_db'
});

// route untuk halaman utama admin dashboard
router.get('/', (req, res) => {
  res.render('admin', {
    partial: null,
    data: [] // ini HARUS ADA
  });
});



router.get('/pengguna', (req, res) => {
    const dataPengguna = [
        { nama: 'Siti Aminah', email: 'siti@example.com', username: 'sitiaminah', role: 'admin' },
        { nama: 'Budi Hartono', email: 'budi@example.com', username: 'budih', role: 'user' }
    ];

    res.render('admin', {
        partial: 'partials/pengguna',
        data: dataPengguna
    });
});


// route untuk halaman pengaduan
router.get('/pengaduan', (req, res) => {
  con.query('SELECT * FROM pengaduan', (err, results) => {
    if (err) {
      console.error(err);
      return res.render('admin', {
        partial: 'partials/pengaduan',
        data: []
      });
    }
    // Format data if needed
    res.render('admin', {
      partial: 'partials/pengaduan',
      data: results
    });
  });
});


module.exports = router;
