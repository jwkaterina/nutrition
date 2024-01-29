import { Nutrients, NutrientsProp, Recipe } from "@/app/types/types";

const RecipeNutrientsCalculator = (recipe: Recipe): Nutrients => {
    const calories: number = recipe.nutrients.calories;
    const totalNutrients: NutrientsProp = recipe.nutrients.totalNutrients;
    const totalDaily: NutrientsProp = recipe.nutrients.totalDaily;
    const totalWeight: number = recipe.nutrients.totalWeight;
    const servings: number = recipe.servings;

    const newCalories: number = calories / servings;
    const newTotalNutrients: NutrientsProp = Object.fromEntries(
          Object.entries(totalNutrients).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity / servings,
            unit: value.unit
        }])
    );
    
    const newTotalDaily: NutrientsProp = Object.fromEntries(
        Object.entries(totalDaily).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity / servings,
            unit: value.unit
        }])
    );
    
    const newTotalWeight: number = totalWeight / servings;

    return({
        calories: newCalories,
        totalNutrients: newTotalNutrients,
        totalDaily: newTotalDaily,
        totalWeight: newTotalWeight
    });  
}

export default RecipeNutrientsCalculator;