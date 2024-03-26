import loadedRecipe from '../../../../../test/objects/loaded-recipe.json';
import recipeRemovedID from '../../../../../test/objects/recipe-removedID.json'
import removeID from '../../../../../app/analysis/components/form/utils/removeID';

describe("removes id from loaded recipes", () => {

    it('should remove id', () => {
        
        const recipeWithoutIDs = removeID(loadedRecipe);
        expect(recipeWithoutIDs).toEqual(recipeRemovedID);
    });
});