const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login (dummy logic dulu)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        return res.redirect('/admin');
    }
    res.send('Login gagal!');
});

module.exports = router;
