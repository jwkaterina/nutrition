const fs = require('fs');

const cors = require('cors')({ origin: true });

const express = require('express');
const bodyParser = require('body-parser');

const foodRoutes = require('./routes/food-routes');
const usersRoutes = require('./routes/users-routes');
const recipeRoutes = require('./routes/recipe-routes');
const menuRoutes = require('./routes/menu-routes');
const apiRoutes = require('./routes/api-routes');
const HttpError = require('./models/http-error');

const app = express();
app.use(cors);

app.use(bodyParser.json({ limit: '5mb' }));

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
    console.error('Could not find this route.');
    const error = new HttpError('Oops, something went wrong.', 404);
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
    console.log(error);

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

module.exports = { app };
