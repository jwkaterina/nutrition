const express = require('express');
const multer = require('../middleware/multer');
const compress = require('../middleware/file-compress');
const gcpStorageControllers = require('../storage-controllers/gcpStorage-controllers');

const foodControllers = require('../db-controllers/food-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/', foodControllers.getFoods);

router.post(
    '/',
    multer.all,
    compress.compressFile,
    gcpStorageControllers.putImage,
    foodControllers.createFood
);

router.delete('/:id', foodControllers.deleteFood);

module.exports = router;
