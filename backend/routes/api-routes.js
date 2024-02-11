const express = require('express');

const foodDatabaseAPIControllers = require('../api-controllers/foodDatabaseAPI-controllers');

const router = express.Router();

router.get('/:query', foodDatabaseAPIControllers.autocomplete);

module.exports = router;