const laporanSchema = new mongoose.Schema({
    nama: String,
    judul: String,
    detail: String,
    instansi: String,
    jenis: String,
    lampiran: String,
    status: { type: String, default: 'Belum diproses' },
    tanggal: { type: Date, default: Date.now }
});
