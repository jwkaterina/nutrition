const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Food = require('../models/food');
const User = require('../models/user');

const getFoodByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithFood;
  try {
    userWithFood = await User.findById(userId).populate('foods');
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later',
      500
    );
    return next(error);
  }

  if (!userWithFood) {
    return next(
      new HttpError('Could not find food for the provided user id.', 404)
    );
  }

  res.json({
    foods: userWithFood.foods.map(food =>
      food.toObject({ getters: true })
    )
  });
};

const createFood = async (req, res, next) => {

  const { food, creator } = req.body;

  const createdFood = new Food({
    food,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating food failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  let existingFood
  try {
    existingFood = await Food.findOne({ "food.food.label": food.food.label })
  } catch (err) {
    const error = new HttpError(
      'Creating food failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingFood) {
    const error = new HttpError(
      'Food exists already.',
      422
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFood.save({ session: sess });
    user.foods.push(createdFood);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating food failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ food: createdFood });
};

const deleteFood = async (req, res, next) => {
  const foodId = req.params.pid;

  let food;
  try {
    food = await Food.findById(foodId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete food.',
      500
    );
    return next(error);
  }

  if (!food) {
    const error = new HttpError('Could not find food for this id.', 404);
    return next(error);
  }

  if (food.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this food.',
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await food.deleteOne({ session: sess });
    food.creator.foods.pull(food);
    await food.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete food.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted food.' });
};

exports.getFoodByUserId = getFoodByUserId;
exports.createFood = createFood;
exports.deleteFood = deleteFood;
