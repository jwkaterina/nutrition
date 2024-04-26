import { combineRecipes } from "./combine-recipes";
import recipe from '@/app/test_objects/loaded-recipe.json';

describe('combine recipes', () => {

    it('should remove recipes with zero servings and combine recipes with the same id', () => {

        const recipes = [
            {
                selectedRecipeId: recipe.id,
                selectedRecipe: recipe.recipe,
                selectedServings: 0
            },
            {
                selectedRecipeId: recipe.id,
                selectedRecipe: recipe.recipe,
                selectedServings: 3
            },
            {
                selectedRecipeId: recipe.id,
                selectedRecipe: recipe.recipe,
                selectedServings: 2
            },
        ];

        const combinedRecipes = [
            {
                selectedRecipeId: recipe.id,
                selectedRecipe: recipe.recipe,
                selectedServings: 5
            }
        ]
        expect(combineRecipes(recipes)).toEqual(combinedRecipes);
    })
})