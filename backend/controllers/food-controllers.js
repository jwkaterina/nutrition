const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Food = require('../models/food');
const User = require('../models/user');

const getFoodById = async (req, res, next) => {
  const foodId = req.params.pid;

  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find food.',
      500
    );
    return next(error);
  }

  if (!food) {
    const error = new HttpError(
      'Could not find a food for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ food: food.toObject({ getters: true }) });
};

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
    // image:
    //   'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
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

const updateFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, calories } = req.body;
  const foodId = req.params.pid;

  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update food.',
      500
    );
    return next(error);
  }

  food.title = title;
  food.calories = calories;

  try {
    await food.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update food.',
      500
    );
    return next(error);
  }

  res.status(200).json({ food: food.toObject({ getters: true }) });
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

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await food.remove({ session: sess });
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

exports.getFoodById = getFoodById;
exports.getFoodByUserId = getFoodByUserId;
exports.createFood = createFood;
exports.updateFood = updateFood;
exports.deleteFood = deleteFood;
