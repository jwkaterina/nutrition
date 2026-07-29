const express = require('express');
const { check } = require('express-validator');

const usersController = require('../db-controllers/users-controllers');

const router = express.Router();

router.post(
    '/signup',
    [
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()
        .isEmail(),
        check('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
            .matches(/[A-Za-z]/).withMessage('Password must contain a letter.')
            .matches(/[0-9]/).withMessage('Password must contain a number.')
    ], 
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
