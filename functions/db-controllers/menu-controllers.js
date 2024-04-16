const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Menu = require('../models/menu');
const User = require('../models/user');

const getMenus = async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithMenu;
    try {
        userWithMenu = await User.findById(userId).populate('menus');
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not find menu. Try again later.',
            500
        );
        return next(error);
    }

    if (!userWithMenu) {
        console.error('Could not find menu by id.')
        return next(
        new HttpError('Could not find menu. Try again later.', 404)
        );
    }

    res.json({
        menus: userWithMenu.menus.map(menu =>
            menu.toObject({ getters: true })
        )
    });
};

const createMenu = async (req, res, next) => {

    const { menu } = req.body;

    console.log(menu);

    const createdMenu = new Menu({
        menu,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Could not add menu to favorites. Try again later.', 500);
        return next(error);
    }

    if (!user) {
        console.error('Could not find user by id.');
        const error = new HttpError('Could not add menu to favorites. Try again later.', 404);
        return next(error);
    }

    let existingMenu
    try {
        existingMenu = await Menu.findOne({ "menu.name": menu.name, "creator": req.userData.userId})
    } catch (err) {
        console.error(err);
        const error = new HttpError(
        'Could not add menu to favorites. Try again later.',
        500
        );
        return next(error);
    }

    if (existingMenu) {
        const error = new HttpError(
        'Menu with this name exists already.',
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
        console.error(err);
        const error = new HttpError(
        'Could not add menu to favorites. Try again later.',
        500
        );
        return next(error);
    }

    res.status(201).json({ menu: createdMenu });
};

const updateMenu = async (req, res, next) => {

    const { updatedMenu } = req.body;
    const menuId = req.params.id;
    console.log(updatedMenu);

    let menu;
    try {
        menu = await Menu.findById(menuId);
    } catch (err) {
        console.error(err);
        const error = new HttpError(
        'Could not update menu in favorites. Try again later.',
        500
        );
        return next(error);
    }

    if (!menu) {
        console.error('Could not find menu by id.');
        const error = new HttpError('Could not update menu in favorites. Try again later.', 404);
        return next(error);
    }

    if (menu.creator.toString() !== req.userData.userId) {
        console.error('Not authorized.');
        const error = new HttpError('You are not allowed to edit this menu.', 401);
        return next(error);
    }


    menu.menu = updatedMenu;

    try {
        await menu.save();
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not update menu in favorites. Try again later.',
            500
        );
        return next(error);
    }

    res.status(200).json({ menu: menu.toObject({ getters: true }) });
};

const deleteMenu = async (req, res, next) => {
    const menuId = req.params.id;

    let menu;
    try {
        menu = await Menu.findById(menuId).populate('creator');
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not delete menu. Try again later.',
            500
        );
        return next(error);
    }

    if (!menu) {
        console.error('Could not find menu by id.');
        const error = new HttpError('Could not delete menu. Try again later.', 404);
        return next(error);
    }

    if (menu.creator.id !== req.userData.userId) {
        console.error('Not authorized');
        const error = new HttpError(
            'You are not allowed to delete this menu.',
            401
        );
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
        console.error(err);
        const error = new HttpError(
            'Could not delete menu. Try again later.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted menu.' });
};

exports.getMenus = getMenus;
exports.createMenu = createMenu;
exports.deleteMenu = deleteMenu;
exports.updateMenu = updateMenu;
