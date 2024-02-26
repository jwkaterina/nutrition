const fs = require('fs');

const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const User = require('../models/user');

const getRecipes = async (req, res, next) => {
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

const createRecipe = async (req, res, next) => {

const { recipe } = req.body;
const parsedRecipe = JSON.parse(recipe);

const createdRecipe = new Recipe({
    recipe: parsedRecipe,
    image: req.file ? req.file.path : null,
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
const { recipeString } = req.body;
const updatedRecipe = JSON.parse(recipeString);

const undatedImage = req.file ? req.file.path : null;
const recipeId = req.params.pid;

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
if(undatedImage) {
    fs.unlink(recipe.image, err => {
        console.log(err);
    });
    recipe.image = undatedImage;
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
const recipeId = req.params.pid;

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

const imagePath = recipe.image;

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

if(recipe.image) fs.unlink(imagePath, err => {
    console.log(err);
});

res.status(200).json({ message: 'Deleted recipe.' });
};

exports.getRecipes = getRecipes;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
