const express = require('express');
const router = express.Router();

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
  const dummyData = [
    {
      _id: '1',
      nama: 'Surya Ray',
      email: 'ray@gmail.com',
      telp: '087123123444',
      isi: 'Apakah nomor pengaduan itu dan apa yang harus saya lakukan terhadap nomor pengaduan ini?',
      tanggal: '07/04/2018',
      status: 'Menunggu'
    },
    {
      _id: '2',
      nama: 'Wahid Ari',
      email: 'wahid.ari@gmail.com',
      telp: '087850866665',
      isi: 'Apakah Aplikasi Pengaduan Masyarakat Dispendukcapil Bangkalan ini?',
      tanggal: '07/04/2018',
      status: 'Ditanggapi'
    }
  ];

  res.render('admin', {
    partial: 'partials/pengaduan', // path dari views/partials/pengaduan.ejs
    data: dummyData
  });
});


module.exports = router;
