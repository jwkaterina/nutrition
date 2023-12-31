import { RecipeProp } from "@/app/types/types";
import { setToLocalStorage } from "../services/local-storage";

type ACTIONTYPE = { 
    type: 'delete',
    index: number
}

export const  RecipeReducer = (recipes: RecipeProp[], action: ACTIONTYPE) => {
    switch (action.type) {
        case 'delete': {
            const newRecipes = recipes.filter((recipes, i) => i != action.index);
            saveRecipe(newRecipes);
            return newRecipes;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const saveRecipe = (recipes: RecipeProp[]) => {
    setToLocalStorage('recipes', recipes);
}