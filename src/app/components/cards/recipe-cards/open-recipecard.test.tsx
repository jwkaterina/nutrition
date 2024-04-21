import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenRecipeCard from './open-recipecard';
import RecipeHeaderCard from './header-recipecard';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import CompositionCard from '../../analysis-cards/composition-card';
import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import VitaminsCard from '../../analysis-cards/vitamins-card';
import MineralsCard from '../../analysis-cards/minerals-card';
import FatsCard from '../../analysis-cards/fats-card';
import recipe from '@/app/test_objects/loaded-recipe.json'

jest.mock('./header-recipecard');
jest.mock('../../analysis-cards/dailyvalue-card');
jest.mock('../../analysis-cards/composition-card');
jest.mock('../../analysis-cards/bignutrients-card');
jest.mock('../../analysis-cards/vitamins-card');
jest.mock('../../analysis-cards/minerals-card');
jest.mock('../../analysis-cards/fats-card');

describe('open recipe card', () => {

    it('should render open recipe card', async() => {

        const props = {
            recipe: recipe.recipe,
            image: recipe.image
        };

        const weight: number = recipe.recipe.nutrients.totalWeight;
        const devideBy: number = weight / 100;
    
        const proteinPer100gram: number = recipe.recipe.nutrients.totalNutrients.PROCNT.quantity / devideBy;
        const carbsPer100gram: number = recipe.recipe.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
        const fatPer100gram: number = recipe.recipe.nutrients.totalNutrients.FAT.quantity / devideBy;
        render(<OpenRecipeCard {...props} />);

        expect(RecipeHeaderCard).toHaveBeenCalled();
        expect(DailyValueCard).toHaveBeenCalledWith({content: props.recipe.nutrients}, {});
        expect(BigNutrientsCard).toHaveBeenCalledWith({content: props.recipe.nutrients}, {});
        expect(VitaminsCard).toHaveBeenCalledWith({content: props.recipe.nutrients}, {});
        expect(MineralsCard).toHaveBeenCalledWith({content: props.recipe.nutrients}, {});
        expect(FatsCard).toHaveBeenCalledWith({content: props.recipe.nutrients}, {});
        expect(CompositionCard).toHaveBeenCalledWith({protein: proteinPer100gram, carbs: carbsPer100gram, fat: fatPer100gram}, {})
    });
})