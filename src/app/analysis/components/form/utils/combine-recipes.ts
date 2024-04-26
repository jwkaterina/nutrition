import { RecipeWithServings } from "@/app/types/types";

export const combineRecipes = (currentRecipes: RecipeWithServings[]): RecipeWithServings[] => {

    const recipes = currentRecipes.filter(recipe => recipe.selectedServings != 0);
    const combinedRecipes = [];

    for (const recipe of recipes) {
        const { selectedRecipeId: id, selectedServings, selectedRecipe } = recipe;
    
        const existingRecipeIndex = combinedRecipes.findIndex(r => r.selectedRecipeId === id);
    
        if (existingRecipeIndex !== -1) {
            combinedRecipes[existingRecipeIndex].selectedServings += selectedServings;
        } else {
            combinedRecipes.push({ selectedRecipeId: id, selectedServings, selectedRecipe });
        }
    }
  
    return combinedRecipes;
}