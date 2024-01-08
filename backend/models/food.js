const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const foodSchema = new Schema({
    food: {
        food: {
            category: { type: String, required: true },
            categoryLabel: { type: String, required: true },
            foodId: { type: String, required: true },
            image: { type: String, required: true },
            knownAs: { type: String, required: true },
            label: { type: String, required: true },
            nutrients: {
                ENERC_KCAL: { type: Number, required: true },
                PROCNT: { type: Number, required: true },
                FAT: { type: Number, required: true },
                CHOCDF: { type: Number, required: true },
                FIBTG: { type: Number, required: false }
            }
        },
        measures: [{
            uri: { type: String, required: true },
            label: { type: String, required: true },
            weight: { type: Number, required: true }
        }]
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Food', foodSchema);