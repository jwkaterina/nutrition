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
    } catch (error) {
        console.error(error);
        throw new HttpError('Could not find any results', 404);
    }
}

exports.autocomplete = autocomplete;
