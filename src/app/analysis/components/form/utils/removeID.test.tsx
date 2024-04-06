import loadedRecipeWithIDs from '../../../../test_objects/loaded-recipe-withIDs.json';
import loadedRecipe from '../../../../test_objects/loaded-recipe.json'
import removeID from './removeID';

describe("removes id from loaded recipes", () => {

    it('should remove id', () => {
        
        const recipeWithoutIDs = removeID(loadedRecipeWithIDs);
        expect(recipeWithoutIDs).toEqual(loadedRecipe);
    });
});