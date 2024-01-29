import { Nutrients, NutrientsProp } from "@/app/types/types";

const RecipeNutrientsCalculator = (nutrients: Nutrients, totalServings: number, selectedServings: number): Nutrients => {
    const calories: number = nutrients.calories;
    const totalNutrients: NutrientsProp = nutrients.totalNutrients;
    const totalDaily: NutrientsProp = nutrients.totalDaily;
    const totalWeight: number = nutrients.totalWeight;

    const newCalories: number = calories * selectedServings / totalServings;
    const newTotalNutrients: NutrientsProp = Object.fromEntries(
          Object.entries(totalNutrients).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity * selectedServings / totalServings,
            unit: value.unit
        }])
    );
    
    const newTotalDaily: NutrientsProp = Object.fromEntries(
        Object.entries(totalDaily).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity * selectedServings / totalServings,
            unit: value.unit
        }])
    );
    
    const newTotalWeight: number = totalWeight * selectedServings / totalServings;

    return({
        calories: newCalories,
        totalNutrients: newTotalNutrients,
        totalDaily: newTotalDaily,
        totalWeight: newTotalWeight
    });  
}

export default RecipeNutrientsCalculator;