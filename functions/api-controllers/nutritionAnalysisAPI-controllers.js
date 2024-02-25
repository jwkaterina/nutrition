const fetch = require("node-fetch");
const HttpError = require('../models/http-error');

const appId= "8db7e817";
const appKey= "198f749fbaa82a2129cf6aba6d0b93f0";

const analyseRecipe = async (req, res, next) => {

    const ingredients = req.body.ingredients;
    
    const url = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
    },
        body: JSON.stringify({
            "title": "Fresh Ham Roasted With Rye Bread and Dried Fruit Stuffing",
            "ingr": ingredients
        })
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const result = await response.json();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Ensure that all ingredients are spelled correctly and try again.', 404);
        return next(error);
    }
}

exports.analyseRecipe = analyseRecipe;