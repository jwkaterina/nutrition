const fs = require('fs');

const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const gcpStorage = require('../storage-controllers/gcpStorage-controllers');

const getAllRecipes = async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithRecipe;
    try {
        userWithRecipe = await User.findById(userId).populate('recipes');
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not find recipe. Try again later.',
            500
        );
        return next(error);
    }

    if (!userWithRecipe) {
        console.error('Could not find user by id.');
        return next(
        new HttpError('Could not find recipe. Try again later.', 404)
        );
    }

    res.json({
        recipe: userWithRecipe.recipes.map(recipe =>
            recipe.toObject({ getters: true })
        )
    });
};

const getRecipesById = async (req, res, next) => {
    const recipeID = req.params.id;
    let recipe;
    try {
        recipe = await Recipe.findById(recipeID);
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not find recipe. Try again later.',
            500
        );
        return next(error);
    }

    if (!recipe) {
        console.error('Could not find recipe by id.');
        return next(
        new HttpError('Could not find recipe. Try again later.', 404)
        );
    }

    res.json({
        recipe: recipe.toObject({ getters: true }) 
    });

}

const createRecipe = async (req, res, next) => {

    let parsedRecipe;
    try {
        const { recipe } = req.body;
        parsedRecipe = typeof recipe === 'string' ? JSON.parse(recipe) : recipe;
    } catch (err) {
        return next(new HttpError('Invalid recipe data.', 400));
    }

    const createdRecipe = new Recipe({
        recipe: parsedRecipe,
        image: (req.image && req.image.url) || req.body.imageUrl || null,
        imageName: req.image && req.image.fileName,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Could not add recipe to favorites. Try again later.', 500);
        return next(error);
    }

    if (!user) {
        console.error('Could not find user by id.');
        const error = new HttpError('Could not add recipe to favorites. Try again later.', 404);
        return next(error);
    }

    let existingRecipe
    try {
        existingRecipe = await Recipe.findOne({ "recipe.name": parsedRecipe.name, "creator": req.userData.userId});
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not add recipe to favorites. Try again later.',
            500
        );
        return next(error);
    }

    if (existingRecipe) {
        const error = new HttpError(
            'Recipe with this name exists already.',
            422
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdRecipe.save({ session: sess });
        user.recipes.push(createdRecipe);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Creating recipe failed, please try again.Could not add recipe to favorites. Try again later.',
        );
        return next(error);
    }

    res.status(201).json({ recipe: createdRecipe });
};

const updateRecipe = async (req, res, next) => {
    let updatedRecipe;
    try {
        const { recipeString } = req.body;
        updatedRecipe = typeof recipeString === 'string' ? JSON.parse(recipeString) : recipeString;
    } catch (err) {
        return next(new HttpError('Invalid recipe data.', 400));
    }

    const updatedImage = (req.image && req.image.url) || req.body.imageUrl;
    const recipeId = req.params.id;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId,);
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not update recipe in favorites. Try again later.',
            500
        );
        return next(error);
    }

    if (!recipe) {
        console.error('Could not find recipe by id.');
        const error = new HttpError('Could not update recipe in favorites. Try again later.', 404);
        return next(error);
    }

    if (recipe.creator.toString() !== req.userData.userId) {
        console.error('Not authorized.');
        const error = new HttpError('You are not allowed to edit this recipe.', 401);
        return next(error);
    }

    recipe.recipe = updatedRecipe;
    recipe.markModified('recipe');
    if(updatedImage) {
        if (recipe.imageName) {
            try {
                await gcpStorage.deleteImage(recipe.imageName);
            } catch(err) {
                return next(err);
            }
        }
        recipe.image = updatedImage;
        if (req.image) recipe.imageName = req.image.fileName;
    }

    try {
        await recipe.save();
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not update recipe in favorites. Try again later.',
            500
        );
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

const deleteRecipe = async (req, res, next) => {
    const recipeId = req.params.id;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId).populate('creator');
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not delete recipe. Try again later.',
            500
        );
        return next(error);
    }

    if (!recipe) {
        console.error('Could not find recipe by id.');
        const error = new HttpError('Could not delete recipe. Try again later.', 404);
        return next(error);
    }

    if (recipe.creator.id !== req.userData.userId) {
        console.error('Not authorized.');
        const error = new HttpError(
            'You are not allowed to delete this recipe.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await recipe.deleteOne({ session: sess });
        recipe.creator.recipes.pull(recipe);
        await recipe.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not delete recipe. Try again later.',
            500
        );
        return next(error);
    }

    if(recipe.imageName) {
        try {
            await gcpStorage.deleteImage(recipe.imageName);
        } catch(err) {
            return next(err);
        }
    }

    try {
        await modifyMenus(recipeId, recipe.creator);
    } catch(err) {
        console.error(err);
        const error = new HttpError(
            'Could not modify menu. Try again later.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted recipe.' });
};

const modifyMenus = async(recipeId, user) => {
    let userWithMenu;
    try {
        userWithMenu = await User.findById(user.id).populate('menus');
    } catch (err) {
        throw new HttpError('Could not find menu. Try again later.', 500);
    }

    if (!userWithMenu) {
        throw new HttpError('Could not find menu. Try again later.', 404);
    }

    for (const menu of userWithMenu.menus) {
        menu.menu.recipes = menu.menu.recipes.filter(recipe => recipe.selectedRecipe != recipeId);
        const ingredients = menu.menu.ingredients;
        const ingredientsEmpty = !ingredients || ingredients.length === 0;
        if (menu.menu.recipes.length === 0 && ingredientsEmpty) {
            console.log('empty menu');
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await menu.deleteOne({ session: sess });
            user.menus.pull(menu);
            await user.save({ session: sess });
            await sess.commitTransaction();
        } else {
            menu.markModified('menu');
            await menu.save();
        }
    }
}

exports.getAllRecipes = getAllRecipes;
exports.getRecipesById = getRecipesById;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
