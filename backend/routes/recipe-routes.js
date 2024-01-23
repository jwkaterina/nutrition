const express = require('express');

const recipeControllers = require('../controllers/recipe-controllers');

const router = express.Router();

router.get('/user/:uid', recipeControllers.getRecipeByUserId);

router.post(
  '/', recipeControllers.createRecipe
);

router.delete('/:pid', recipeControllers.deleteRecipe);

module.exports = router;
