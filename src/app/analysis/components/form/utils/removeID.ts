import { Nutrient, LoadedRecipe } from "@/app/types/types";

const removeID = (recipe: any): LoadedRecipe => {
    const newTotalNutrients = Object.fromEntries(
        Object.entries(recipe.recipe.nutrients.totalNutrients)
            .filter(([key]) => key !== 'id' && key !== '_id')
            .map(([key, value]) => [key, {
                label: (value as Nutrient).label,
                quantity: (value as Nutrient).quantity,
                unit: (value as Nutrient).unit
            }])
    );
    const newTotalDaily = Object.fromEntries(
        Object.entries(recipe.recipe.nutrients.totalDaily)
            .filter(([key]) => key !== 'id' && key !== '_id')
            .map(([key, value]) => [key, {
                label: (value as Nutrient).label,
                quantity: (value as Nutrient).quantity,
                unit: (value as Nutrient).unit
            }])
    );
    return {
        id: recipe.id,
        creator: recipe.creator,
        image: recipe.image,
        imageName: recipe.imageName,
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