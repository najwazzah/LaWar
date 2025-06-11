const express = require('express');
const router = express.Router();

// Login page
router.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Handle login
router.post('/login', (req, res) => {
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

module.exports = router;