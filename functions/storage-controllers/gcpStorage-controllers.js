const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getImage = async (req, res, next) => {

    const path = req.params.path;

    res.json({
        status: "ok"
    });
};

exports.getImage = getImage;