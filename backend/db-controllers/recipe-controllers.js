const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const User = require('../models/user');

const getRecipeByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithRecipe;
  try {
    userWithRecipe = await User.findById(userId).populate('recipes');
  } catch (err) {
    const error = new HttpError(
      'Fetching recipe failed, please try again later',
      500
    );
    return next(error);
  }

  if (!userWithRecipe) {
    return next(
      new HttpError('Could not find recipe for the provided user id.', 404)
    );
  }

  res.json({
    recipe: userWithRecipe.recipes.map(recipe =>
      recipe.toObject({ getters: true })
    )
  });
};

const createRecipe = async (req, res, next) => {

  const { recipe, creator } = req.body;

  const createdRecipe = new Recipe({
    recipe,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating recipe failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  let existingRecipe
  try {
    existingRecipe = await Recipe.findOne({ "recipe.name": recipe.name });
  } catch (err) {
    const error = new HttpError(
      'Creating recipe failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingRecipe) {
    const error = new HttpError(
      'Recipe exists already.',
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
    console.log(err)
    const error = new HttpError(
      'Creating recipe failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ recipe: createdRecipe });
};

const updateRecipe = async (req, res, next) => {

  const { updatedRecipe } = req.body;
  const recipeId = req.params.pid;

  let recipe;
  try {
    recipe = await Recipe.findById(recipeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update recipe.',
      500
    );
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError('Could not find recipe for this id.', 404);
    return next(error);
  }

  recipe.recipe = updatedRecipe;

  try {
    await recipe.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update recipe.',
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
    const error = new HttpError(
      'Something went wrong, could not delete recipe.',
      500
    );
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError('Could not find recipe for this id.', 404);
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
    const error = new HttpError(
      'Something went wrong, could not delete recipe.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted recipe.' });
};

exports.getRecipeByUserId = getRecipeByUserId;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
