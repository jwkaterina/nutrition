import { LoadedRecipe, NutrientsProp } from "@/app/types/types";

const removeID = (recipe: any) => {
    const newTotalNutrients = Object.fromEntries(
        Object.entries(recipe.recipe.nutrients.totalNutrients)
            .filter(([key]) => key !== 'id' && key !== '_id')
            .map(([key, value]) => [key, {
                label: (value as NutrientsProp).label,
                quantity: (value as NutrientsProp).quantity,
                unit: (value as NutrientsProp).unit
            }])
    );
    const newTotalDaily = Object.fromEntries(
        Object.entries(recipe.recipe.nutrients.totalDaily)
            .filter(([key]) => key !== 'id' && key !== '_id')
            .map(([key, value]) => [key, {
                label: (value as NutrientsProp).label,
                quantity: (value as NutrientsProp).quantity,
                unit: (value as NutrientsProp).unit
            }])
    );
    return {
        id: recipe.id,
        recipe: {
            name: recipe.recipe.name,
            ingredients: recipe.recipe.ingredients,
            nutrients: {
                calories: recipe.recipe.nutrients.calories,
                totalNutrients: newTotalNutrients,
                totalDaily: newTotalDaily,
                totalWeight: recipe.recipe.nutrients.totalWeight
            },
            servings: recipe.recipe.servings
        }
    };
}

export default removeID;