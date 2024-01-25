const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Menu = require('../models/menu');
const User = require('../models/user');

const getMenuByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithMenu;
  try {
    userWithMenu = await User.findById(userId).populate('menus');
  } catch (err) {
    const error = new HttpError(
      'Fetching menu failed, please try again later',
      500
    );
    return next(error);
  }

  if (!userWithMenu) {
    return next(
      new HttpError('Could not find menu for the provided user id.', 404)
    );
  }

  res.json({
    menus: userWithMenu.menus.map(menu =>
      menu.toObject({ getters: true })
    )
  });
};

const createMenu = async (req, res, next) => {

  const { menu, creator } = req.body;

  const createdMenu = new Menu({
    menu,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating menu failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  let existingMenu
  try {
    existingMenu = await Menu.findOne({ "menu.name": menu.name })
  } catch (err) {
    const error = new HttpError(
      'Creating menu failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingMenu) {
    const error = new HttpError(
      'Menu exists already.',
      422
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdMenu.save({ session: sess });
    user.menus.push(createdMenu);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating menu failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ menu: createdMenu });
};

const deleteMenu = async (req, res, next) => {
  const menuId = req.params.pid;

  let menu;
  try {
    menu = await Menu.findById(menuId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete menu.',
      500
    );
    return next(error);
  }

  if (!menu) {
    const error = new HttpError('Could not find menu for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await menu.deleteOne({ session: sess });
    menu.creator.menus.pull(menu);
    await menu.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete menu.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted menu.' });
};

exports.getMenuByUserId = getMenuByUserId;
exports.createMenu = createMenu;
exports.deleteMenu = deleteMenu;