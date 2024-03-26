import recipe1 from '../../../../objects/recipe1.json';
import recipe2 from '../../../../objects/recipe2.json';
import { RecipeNutrientsCalculator, MenuNutrientsCalculator } from '../../../../../app/analysis/components/form/utils/nutrients-calculator';

describe("nutrients-calculator", () => {

    it('should calculate nutrients for a recipe', () => {

        const recipe = {
            nutrients: recipe1,
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
            nutrients: {
                calories: recipe1.calories,
                totalNutrients: recipe1.totalNutrients,
                totalDaily: recipe1.totalDaily,
                totalWeight: recipe1.totalWeight
            },
            selectedServings: 1
        }
        const recipe_2 = {
            nutrients: {
                calories: recipe2.calories,
                totalNutrients: recipe2.totalNutrients,
                totalDaily: recipe2.totalDaily,
                totalWeight: recipe2.totalWeight
            },          
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