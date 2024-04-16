const express = require('express');

const menuControllers = require('../db-controllers/menu-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/', menuControllers.getMenus);

router.post(
    '/', menuControllers.createMenu
);

router.patch('/:id', menuControllers.updateMenu);

router.delete('/:id', menuControllers.deleteMenu);

module.exports = router;
