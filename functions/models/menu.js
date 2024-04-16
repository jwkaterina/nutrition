const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuRecipe = new Schema({
    selectedRecipe: { type: mongoose.Types.ObjectId, required: true, ref: 'Recipe'},
    selectedServings: { type: Number, required: true },
})

const menuSchema = new Schema({
    menu:{
        name: { type: String, required: true },
        ingredients: [{ type: String, required: false }],
        recipes: [{ type: MenuRecipe, required: false}],
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Menu', menuSchema);