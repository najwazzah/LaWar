const express = require('express');
const router = express.Router();

// route untuk halaman utama admin dashboard
router.get('/', (req, res) => {
  res.render('admin', {
    partial: null,
    data: [] // ini HARUS ADA
  });
});

router.get('/data', (req, res) => {
  console.log("✅ /admin/data terpanggil");
  res.render('admin', {
    partial: 'partials/data',
    data: [] // bisa dummy atau real
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
