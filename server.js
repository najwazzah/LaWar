const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lawar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'lawar_secret',
  resave: false,
  saveUninitialized: true
}));

// GET: Login page
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// POST: Handle login
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

// GET: Admin Dashboard
app.get('/dashboard/admin', (req, res) => {
  if (req.session.role !== 'admin') return res.redirect('/');
  res.render('admin');
});

// GET: Warga Dashboard
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

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
