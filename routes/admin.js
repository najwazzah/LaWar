const express = require('express');
const router = express.Router();
const Laporan = require('../models/laporan');

// READ - Tampilkan semua laporan
router.get('/', async (req, res) => {
    const laporan = await Laporan.find();
    res.render('admin', { laporan });
});

// UPDATE - Ganti status
router.post('/update/:id', async (req, res) => {
    await Laporan.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect('/admin');
});

// DELETE - Hapus laporan
router.post('/delete/:id', async (req, res) => {
    await Laporan.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;
