const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Setup view engine dan lokasi views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup session
app.use(session({
  secret: 'lawar_secret',
  resave: false,
  saveUninitialized: true
}));

// Halaman login (GET)
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Proses login (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const wargaRegex = /^warga\d{3}$/;
  const wargaPassRegex = /^\d{3}wrg$/;

  const adminRegex = /^admin[a-zA-Z]{3}$/;
  const adminPassRegex = /^\d{3}adm$/;

  if (wargaRegex.test(username) && wargaPassRegex.test(password)) {
    req.session.role = 'warga';
    return res.redirect('/dashboard/warga');
  }

  if (adminRegex.test(username) && adminPassRegex.test(password)) {
    req.session.role = 'admin';
    return res.redirect('/dashboard/admin');
  }

  res.render('login', { error: 'Username/password salah' });
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

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Import router admin
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
