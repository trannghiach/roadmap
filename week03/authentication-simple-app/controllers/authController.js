const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const existUser = await User.findOne({ username });
        if(existUser) return res.status(400).json({ message: 'Username already exists!' });

        const harshedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: harshedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ message: 'Username not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Incorrect password!' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });
        res.json({ accessToken });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken").lean();
        if(!user) return res.status(400).json({ message: 'User not found!' });
        res.json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out'});
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};