const express = require('express');
const multer = require('../middleware/multer');

const recipeControllers = require('../db-controllers/recipe-controllers');
const gcpStorageControllers = require('../storage-controllers/gcpStorage-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/', recipeControllers.getRecipes);

router.post(
    '/', 
    multer.all,
    gcpStorageControllers.putImage,
    recipeControllers.createRecipe
);

router.patch(
    '/:pid', 
    multer.all,
    gcpStorageControllers.putImage,
    recipeControllers.updateRecipe
);

router.delete('/:pid', recipeControllers.deleteRecipe);

module.exports = router;
