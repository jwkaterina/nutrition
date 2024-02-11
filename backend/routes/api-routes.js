const express = require('express');

const foodDatabaseAPIControllers = require('../api-controllers/foodDatabaseAPI-controllers');

const router = express.Router();

router.get('/query/:query', foodDatabaseAPIControllers.autocomplete);
router.get('/ingr/:ingr', foodDatabaseAPIControllers.parseQuery);

module.exports = router;