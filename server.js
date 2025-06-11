const express = require('express');
const session = require('express-session');
const path = require('path');

const mysql = require('mysql');
const multer = require('multer');

 var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'lawar_db'
 });


const app = express();

// Setup view engine dan lokasi views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET || 'lawar_secret',
  resave: false,
  saveUninitialized: true
}));


// Halaman login (GET)
//multer storage & file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.role) {
    return next();
  }
  res.redirect('/');
}

// GET: Login page

app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Proses login (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  con.query('SELECT * FROM users WHERE username = ? AND password = ?',
  [username, password], 
  (error, results) => {
    if (error) return res.render('login', { error: 'Database error' });
    if (results.length === 0) return res.render('login', { error: 'Username/password salah' });
    
    // Set session role based on user role
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

// Dashboard admin
app.get('/dashboard/admin', (req, res) => {
  if (req.session.role !== 'admin') return res.redirect('/');
  res.render('admin', { partial: null, data: [] }); // ✅ TAMBAHKAN data: []
});

// Dashboard warga
app.get('/dashboard/warga', (req, res) => {
  if (req.session.role !== 'warga') return res.redirect('/');
  res.render('warga');
});

// GET: Form Pengaduan
app.post('/pengaduan', upload.single('lampiran'), (req, res) => {
  const { judul, detail, instansi, jenis } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  con.query(
    'INSERT INTO pengaduan (judul, detail, instansi, jenis, lampiran) VALUES (?, ?, ?, ?, ?)',
    [judul, detail, instansi, jenis, lampiran],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.send('Gagal menyimpan laporan');
      }
      res.redirect('/dashboard/warga');
    }
  );
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Import router admin
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Error handling
con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
