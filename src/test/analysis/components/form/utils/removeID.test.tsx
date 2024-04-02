import loadedRecipeWithIDs from '../../../../../test/objects/loaded-recipe-withIDs.json';
import loadedRecipe from '../../../../../test/objects/loaded-recipe.json'
import removeID from '../../../../../app/analysis/components/form/utils/removeID';

describe("removes id from loaded recipes", () => {

    it('should remove id', () => {
        
        const recipeWithoutIDs = removeID(loadedRecipeWithIDs);
        expect(recipeWithoutIDs).toEqual(loadedRecipe);
    });
});