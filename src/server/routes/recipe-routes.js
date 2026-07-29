const express = require('express');
const multer = require('../middleware/multer');
const compress = require('../middleware/file-compress');
const recipeControllers = require('../db-controllers/recipe-controllers');
const gcpStorageControllers = require('../storage-controllers/gcpStorage-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(checkAuth);

router.get('/', recipeControllers.getAllRecipes);

router.get('/:id', recipeControllers.getRecipesById);

router.post(
    '/', 
    multer.all,
    compress.compressFile,
    gcpStorageControllers.putImage,
    recipeControllers.createRecipe
);

router.patch(
    '/:id', 
    multer.all,
    compress.compressFile,
    gcpStorageControllers.putImage,
    recipeControllers.updateRecipe
);

router.delete('/:id', recipeControllers.deleteRecipe);

module.exports = router;
