const express = require('express');

const recipeControllers = require('../db-controllers/recipe-controllers');

const router = express.Router();

router.get('/user/:uid', recipeControllers.getRecipeByUserId);

router.post(
  '/', recipeControllers.createRecipe
);

router.patch('/:pid', recipeControllers.updateRecipe);

router.delete('/:pid', recipeControllers.deleteRecipe);

module.exports = router;
