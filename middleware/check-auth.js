const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
            return res.status(400).json({
                error: `"token" fails to match the required format`
            });
        }
        const decoded = jwt.verify(token, process.env.jwtKey);
        req.userData = {
            userId: decoded.userId,
            phoneNumber: decoded.phoneNumber
        };
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token expired'
        });
    }
};