/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const fs = require('fs');
const path = require('path');

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const cors = require('cors')({origin: true});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const foodRoutes = require('./routes/food-routes');
const usersRoutes = require('./routes/users-routes');
const recipeRoutes = require('./routes/recipe-routes');
const menuRoutes = require('./routes/menu-routes');
const apiRoutes = require('./routes/api-routes');
const HttpError = require('./models/http-error');

const app = express();
app.use(cors);

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api', apiRoutes);
app.use('/foods', foodRoutes);
app.use('/recipes', recipeRoutes);
app.use('/users', usersRoutes);
app.use('/menus', menuRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
        console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    console.log(error)

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect('mongodb+srv://jwkaterina:jw0507015599@cluster0.ajgjgkk.mongodb.net/nutrition?retryWrites=true&w=majority')
    .then(() => {
        // app.listen(5001);
        logger.info("Hello logs!", {structuredData: true});
    })
    .catch(err => {
        logger.error("Oops, something went wrong!", err);
        // console.log(err);
    });

exports.app = onRequest(app);
