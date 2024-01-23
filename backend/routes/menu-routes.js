const express = require('express');

const menuControllers = require('../controllers/menu-controllers');

const router = express.Router();

router.get('/user/:uid', menuControllers.getMenuByUserId);

router.post(
  '/', menuControllers.createMenu
);

router.delete('/:pid', menuControllers.deleteMenu);

module.exports = router;
