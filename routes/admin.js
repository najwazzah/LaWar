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
    con.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            return res.render('admin', {
                partial: 'partials/pengguna',
                data: []
            });
        }
        res.render('admin', {
            partial: 'partials/pengguna',
            data: results
        });
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

router.get('/balas/:id', (req, res) => {
  const id = req.params.id;
  // Ubah status menjadi 'Selesai'
  con.query(
    "UPDATE pengaduan SET status = 'Selesai' WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        // Bisa tambahkan pesan error jika ingin
      }
      res.redirect('/admin/pengaduan');
    }
  );
});

router.get('/hapus/:id', (req, res) => {
  const id = req.params.id;
  con.query('DELETE FROM pengaduan WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      // Bisa tampilkan pesan error jika ingin
    }
    res.redirect('/admin/pengaduan');
  });
});

router.get('/hapus-user/:id', (req, res) => {
  const id = req.params.id;
  con.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      // Bisa tampilkan pesan error jika ingin
    }
    res.redirect('/admin/pengguna');
  });
});

module.exports = router;
