const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const multer = require('multer');

const app = express();
const uploadDir = path.join(__dirname, 'public', 'uploads');

if (fs.existsSync(uploadDir) && fs.statSync(uploadDir).isFile()) {
  fs.unlinkSync(uploadDir);
}
fs.mkdirSync(uploadDir, { recursive: true });

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lawar_db'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

app.use(session({
  secret: process.env.SESSION_SECRET || 'lawar_secret',
  resave: false,
  saveUninitialized: true
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpg|jpeg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung!'), false);
  }
};

const upload = multer({ storage, fileFilter });

app.get('/', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  con.query('SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.render('login', { error: 'Database error' });
      }

      if (results.length === 0) {
        return res.render('login', { error: 'Username/password salah' });
      }

      req.session.userId = results[0].id;
      req.session.role = results[0].role;

      if (req.session.role === 'admin') {
        return res.redirect('/dashboard/admin');
      }

      if (req.session.role === 'warga') {
        return res.redirect('/dashboard/warga');
      }

      return res.render('login', { error: 'Role tidak dikenali' });
    }
  );
});

app.get('/dashboard/admin', (req, res) => {
  if (req.session.role !== 'admin') return res.redirect('/');
  res.render('admin', { partial: null, data: [] });
});

function renderWargaPage(req, res, partial = null) {
  if (req.session.role !== 'warga') return res.redirect('/');

  const successMessage = req.session.successMessage || (req.query.success === '1' ? 'Laporan Anda berhasil terkirim!' : null);
  delete req.session.successMessage;

  res.render('warga', {
    partial: partial || null,
    data: [],
    successMessage: successMessage || null
  });
}

app.get('/dashboard/warga', (req, res) => {
  renderWargaPage(req, res, null);
});

app.get('/dashboard/warga/lapor', (req, res) => {
  renderWargaPage(req, res, 'partials/warga_lapor');
});

app.get('/dashboard/warga/riwayat', (req, res) => {
  renderWargaPage(req, res, 'partials/warga_riwayat');
});

app.get('/warga/lapor', (req, res) => {
  res.redirect('/dashboard/warga/lapor');
});

app.get('/warga/riwayat', (req, res) => {
  res.redirect('/dashboard/warga/riwayat');
});

app.post('/pengaduan', upload.single('lampiran'), (req, res) => {
  const { judul, detail, instansi, jenis } = req.body;
  const normalizedJenis = {
    Kerusakan: 'kerusakan',
    Keamanan: 'Keamanan',
    Lingkungan: 'Lingkungan'
  }[jenis] || jenis;
  const lampiran = req.file ? req.file.filename : null;

  if (!judul || !detail || !instansi || !jenis) {
    return res.status(400).send('Semua field laporan wajib diisi.');
  }

  con.query(
    'INSERT INTO pengaduan (judul, detail, instansi, jenis, lampiran) VALUES (?, ?, ?, ?, ?)',
    [judul, detail, instansi, normalizedJenis, lampiran],
    (error, result) => {
      if (error) {
        console.error('Insert pengaduan error:', error);
        return res.status(500).send('Gagal menyimpan laporan. Periksa koneksi database atau struktur tabel pengaduan.');
      }

      req.session.successMessage = 'Laporan Anda berhasil terkirim!';
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).send('Laporan tersimpan, tapi notifikasi gagal dibuat.');
        }
        res.redirect('/dashboard/warga?success=1');
      });
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
