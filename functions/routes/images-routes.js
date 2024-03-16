const express = require('express');
const imageController = require('../storage-controllers/gcpStorage-controllers');


const router = express.Router();

router.get('/:path', imageController.getImage);

module.exports = router;