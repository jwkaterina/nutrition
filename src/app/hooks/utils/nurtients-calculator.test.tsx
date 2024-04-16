import nutrients1 from '../../test_objects/nutrients1.json';
import nutrients2 from '../../test_objects/nutrients2.json';
import { RecipeNutrientsCalculator, MenuNutrientsCalculator } from './nutrients-calculator';

describe("nutrients-calculator", () => {

    it('should calculate nutrients for a recipe', () => {

        const recipe = {
            nutrients: nutrients1,
            totalServings: 3,
            selectedServings: 2
        }

        const calculatedNutrients = RecipeNutrientsCalculator(recipe);
        
        expect(calculatedNutrients.calories).toEqual(1200);
        expect(calculatedNutrients.totalNutrients.CHOCDF.quantity).toEqual(200);
        expect(calculatedNutrients.totalDaily.CHOCDF.quantity).toEqual(80);
        expect(calculatedNutrients.totalWeight).toEqual(400);
    });

    it('should calculate nutrients for a menu', () => {

        const recipe_1 = {
            nutrients: nutrients1,
            selectedServings: 1
        }
        const recipe_2 = {
            nutrients: nutrients2,          
            selectedServings: 2
        }
        const recipesArr = [recipe_1, recipe_2]

        const calculatedNutrients = MenuNutrientsCalculator(recipesArr);
        
        expect(calculatedNutrients.calories).toEqual(2600);
        expect(calculatedNutrients.totalNutrients.CHOCDF.quantity).toEqual(380);
        expect(calculatedNutrients.totalDaily.CHOCDF.quantity).toEqual(150);
        expect(calculatedNutrients.totalWeight).toEqual(1000);
    });
});