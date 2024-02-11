const express = require('express');

const apiControllers = require('../controllers/api-controllers');

const router = express.Router();

router.get('/:query', apiControllers.autocomplete);

module.exports = router;