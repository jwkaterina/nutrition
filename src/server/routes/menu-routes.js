const express = require('express');

const menuControllers = require('../db-controllers/menu-controllers');
const checkAuth = require('../middleware/check-auth');
const multer = require('../middleware/multer');
const compress = require('../middleware/file-compress');
const gcpStorageControllers = require('../storage-controllers/gcpStorage-controllers');

const router = express.Router();
router.use(checkAuth);

router.get('/', menuControllers.getMenus);

router.post('/', multer.all, compress.compressFile, gcpStorageControllers.putImage, menuControllers.createMenu);

router.patch('/:id', multer.all, compress.compressFile, gcpStorageControllers.putImage, menuControllers.updateMenu);

router.delete('/:id', menuControllers.deleteMenu);

module.exports = router;
