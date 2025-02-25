const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(403).json({ message: 'No token provided!' });

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(400).json({ message: 'Invalid token format!' });
    }

    const actualToken = tokenParts[1];
    try {
        const decoded = jwt.verify(actualToken, process.env.ACCESS_KEY);
        req.userId = decoded.userID;
        req.role = decoded.role;
        next();
    } catch(err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const isAdmin = (req, res, next) => {
    if(req.role !== 'admin') return res.status(403).json({ message: "Required Admin role!" });
    next();
};

module.exports = {
    verifyToken,
    isAdmin
};