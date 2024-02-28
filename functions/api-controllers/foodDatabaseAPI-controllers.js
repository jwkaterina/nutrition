const fetch = require("node-fetch");
const HttpError = require('../models/http-error');

const appId= "1ed9471e";
const appKey= "d596751a2948e390e2bcbd335e0564fa";

const autocomplete = async (req, res, next) => {
    const query = req.params.query;

    const url = `https://api.edamam.com/auto-complete?app_id=${appId}&app_key=${appKey}&q=${query}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Could not find any results', 404
        );
        return next(error);
    }
}

const parseQuery = async (req, res, next) => {

    const ingr = req.params.ingr;

    const type = 'cooking';
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${ingr}&nutrition-type=${type}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Could not find any results', 404);
        return next(error);
    }
}

const findNutrients = async (req, res, next) => {

    const { foodId, measure, quantity } = req.body;

    const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appId}&app_key=${appKey}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "ingredients": [
            {
                "quantity": quantity,
                "measureURI": measure,         
                "foodId": foodId
            }
            ]
        })
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Could analyze food, wait 1 munit and try again', 404);
        return next(error);
    }
}

exports.autocomplete = autocomplete;
exports.parseQuery = parseQuery;
exports.findNutrients = findNutrients;
