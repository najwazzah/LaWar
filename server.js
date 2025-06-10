const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');

 var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'lawar_db'
 });

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'lawar_secret',
  resave: false,
  saveUninitialized: true
}));

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

// POST: Handle login
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

// Error handling
con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
