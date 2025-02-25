const express = require('express');
const { register, login, profile, logout } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', verifyToken, profile);

router.get('/admin', verifyToken, isAdmin, (req, res) => res.json({ message: "Welcome, admin!" }));

router.post('/logout', logout);

module.exports = router;