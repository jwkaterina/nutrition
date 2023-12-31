const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const foodSchema = new Schema({
    title: { type: String, required: true },
    calories: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Food', foodSchema);