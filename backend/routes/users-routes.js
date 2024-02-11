const express = require('express');

const usersController = require('../db-controllers/users-controllers');

const router = express.Router();

router.post(
  '/signup', usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
