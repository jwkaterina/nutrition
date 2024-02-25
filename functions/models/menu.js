const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Nutrient = new Schema({
    label: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
})

const Nutrients = new Schema({
    CA: { type: Nutrient, required: false },
    CHOCDF: { type: Nutrient, required: false },
    CHOLE: { type: Nutrient, required: false },
    ENERC_KCAL: { type: Nutrient, required: false },
    FAMS: { type: Nutrient, required: false },
    FAPU: { type: Nutrient, required: false },
    FASAT: { type: Nutrient, required: false },
    FAT: { type: Nutrient, required: false },
    FATRN: { type: Nutrient, required: false },
    FE: { type: Nutrient, required: false },
    FIBTG: { type: Nutrient, required: false },
    FOLAC: { type: Nutrient, required: false },
    FOLDFE: { type: Nutrient, required: false },
    FOLFD: { type: Nutrient, required: false },
    K: { type: Nutrient, required: false },
    MG: { type: Nutrient, required: false },
    NA: { type: Nutrient, required: false },
    NIA: { type: Nutrient, required: false },
    P: { type: Nutrient, required: false },
    PROCNT: { type: Nutrient, required: false },
    RIBF: { type: Nutrient, required: false },
    SUGAR: { type: Nutrient, required: false },
    THIA: { type: Nutrient, required: false },
    TOCPHA: { type: Nutrient, required: false },
    VITA_RAE: { type: Nutrient, required: false },
    VITB12: { type: Nutrient, required: false },
    VITB6A: { type: Nutrient, required: false },
    VITC: { type: Nutrient, required: false },
    VITD: { type: Nutrient, required: false },
    VITK1: { type: Nutrient, required: false },
    WATER: { type: Nutrient, required: false },
    ZN: { type: Nutrient, required: false }
})  

const Recipe = new Schema({
    selectedRecipe: {    
        name: { type: String, required: true },
        image: { type: String, required: false },
        servings: { type: Number, required: true },
        ingredients: [{ type: String, required: true }],
        nutrients: {
            calories: { type: Number, required: true },
            totalNutrients: { type: Nutrients, required: true },
            totalDaily: { type: Nutrients, required: true },
            totalWeight: { type: Number, required: true }
        }},
    selectedServings: { type: Number, required: false },
})

const menuSchema = new Schema({
    menu:{
        name: { type: String, required: true },
        ingredients: [{ type: String, required: false }],
        nutrients: {
            calories: { type: Number, required: true },
            totalNutrients: { type: Nutrients, required: true },
            totalDaily: { type: Nutrients, required: true },
            totalWeight: { type: Number, required: true }
        },
        recipes: [{ type: Recipe, required: false}],
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Menu', menuSchema);