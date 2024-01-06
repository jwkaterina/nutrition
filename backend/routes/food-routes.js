const express = require('express');

const foodControllers = require('../controllers/food-controllers');

const router = express.Router();

router.get('/user/:uid', foodControllers.getFoodByUserId);

router.post(
  '/', foodControllers.createFood
);

router.delete('/:pid', foodControllers.deleteFood);

module.exports = router;
