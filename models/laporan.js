const mongoose = require('mongoose');

const laporanSchema = new mongoose.Schema({
    nama: String,
    isi: String,
    status: { type: String, default: 'Belum diproses' },
    tanggal: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laporan', laporanSchema);
