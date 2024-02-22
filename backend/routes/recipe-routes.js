const express = require('express');

const recipeControllers = require('../db-controllers/recipe-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/user/:uid', recipeControllers.getRecipeByUserId);

router.post(
  '/', fileUpload.single('image'), recipeControllers.createRecipe
);

router.patch('/:pid', fileUpload.single('image'), recipeControllers.updateRecipe);

router.delete('/:pid', recipeControllers.deleteRecipe);

module.exports = router;
