import { useContext } from 'react';
import { MenuNutrientsCalculator, MenuCalculatorProps } from '@/app/hooks/utils/nutrients-calculator';
import { useRecipeFetch } from '@/app/hooks/recipe-hook';
import { StatusContext } from '@/app/context/status-context';
import { Nutrients, StatusType, RecipeWithServings } from '@/app/types/types';

export const useMenuFetch = () => {
    const { fetchRecipeNutrients } = useRecipeFetch();
    const { setMessage, setStatus } = useContext(StatusContext);

    const fetchMenuNutrients = async (ingredientsArray: string[], recipesArray: RecipeWithServings[]): Promise<Nutrients | null> => {

        let nutrientsArr: MenuCalculatorProps[] = [];
        if(recipesArray.length > 0) {
            nutrientsArr = recipesArray.map((recipe) => { 
                return {
                    nutrients: recipe.selectedRecipe.nutrients,
                    selectedServings: recipe.selectedServings
                };
            })
        }
        if(ingredientsArray && ingredientsArray.length > 0) {
            const ingredientsNutrients = await fetchRecipeNutrients(ingredientsArray);
            if(ingredientsNutrients) nutrientsArr.push({
                nutrients: ingredientsNutrients,
                selectedServings: 1
            }); 
        }
        if(nutrientsArr.length > 0) {
            const nutrients: Nutrients = MenuNutrientsCalculator(nutrientsArr);
            return nutrients;
        } else {
            setStatus(StatusType.ERROR);
            setMessage('Could not analyse menu. Choose at least one recipe or ingredient and try again.');
            return null;
        }
    }

    return { fetchMenuNutrients }
}