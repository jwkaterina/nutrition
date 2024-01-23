const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    foods: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Food'}],
    recipes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Recipe'}],
    menus: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Menu'}]
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


