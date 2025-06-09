const express = require('express');
const router = express.Router();
const Laporan = require('../models/laporan');

// Form laporan warga
router.get('/', (req, res) => {
    res.render('warga');
});

// Kirim laporan
router.post('/lapor', async (req, res) => {
    const { nama, isi } = req.body;
    await Laporan.create({ nama, isi });
    res.redirect('/warga');
});

module.exports = router;
