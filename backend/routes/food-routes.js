const express = require('express');
const { check } = require('express-validator');

const foodControllers = require('../controllers/food-controllers');

const router = express.Router();

router.get('/:pid', foodControllers.getFoodById);

router.get('/user/:uid', foodControllers.getFoodByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('calories')
      .not()
      .isEmpty()
  ],
  foodControllers.createFood
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('calories')
      .not()
      .isEmpty()
  ],
  foodControllers.updateFood
);

router.delete('/:pid', foodControllers.deleteFood);

module.exports = router;
