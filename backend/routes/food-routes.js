const express = require('express');

const foodControllers = require('../db-controllers/food-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/user/:uid', foodControllers.getFoodByUserId);

router.post(
  '/', foodControllers.createFood
);

router.delete('/:pid', foodControllers.deleteFood);

module.exports = router;
