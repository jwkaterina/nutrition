const express = require('express');

const menuControllers = require('../db-controllers/menu-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/', menuControllers.getMenus);

router.post(
  '/', menuControllers.createMenu
);

router.patch('/:pid', menuControllers.updateMenu);

router.delete('/:pid', menuControllers.deleteMenu);

module.exports = router;
