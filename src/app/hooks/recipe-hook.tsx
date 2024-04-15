import { useContext } from 'react';
import { RecipeNutrientsCalculator } from '@/app/hooks/utils/nutrients-calculator';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Nutrients } from '@/app/types/types';

export const useRecipeFetch = () => {
    const {sendRequest} = useHttpClient();
    const { setMessage } = useContext(StatusContext);

    const fetchRecipeNutrients = async(ingredientsArray: string[]): Promise<Nutrients> => {

        try {
            const ingredientsContent: Nutrients = await sendRequest(
                `/api/recipe`,
                'POST',
                JSON.stringify({
                    ingredients: ingredientsArray
                }),
                { 'Content-Type': 'application/json' },
                true, false
            );
            const ingredientsNutrients: Nutrients = RecipeNutrientsCalculator({
                nutrients: ingredientsContent, 
                totalServings: 1, 
                selectedServings: 1
            });
            return ingredientsNutrients;
        } catch (error) {
            setMessage('Could not analyse. Ensure that all ingredients are spelled correctly and try again.');
            throw error;
        }
    }

    return { fetchRecipeNutrients }
}