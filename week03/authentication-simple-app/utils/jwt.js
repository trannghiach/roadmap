const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ userID: user._id, role: user.role }, process.env.ACCESS_KEY, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.REFRESH_KEY, { expiresIn: "7d" });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};