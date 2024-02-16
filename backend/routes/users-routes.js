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
    check('password').isLength({ min: 5 })
  ], 
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
