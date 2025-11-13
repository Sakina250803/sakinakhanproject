const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

module.exports = function auth(req, res, next) {
    // Get token from header (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // attach decoded payload (e.g. user id) to request
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};