const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Logging in failed, please try again later.');
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share');
        req.userData = { userId: decodedToken.userId };
        next();
        } catch (err) {
            console.error(err);
            const error = new HttpError('Logging in failed, please try again later.', 401);
            return next(error);
        }
};