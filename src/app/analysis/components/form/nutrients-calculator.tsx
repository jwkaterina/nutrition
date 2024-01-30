import { Nutrients, NutrientsProp } from "@/app/types/types";

interface RecipeCalculatorProps {
    nutrients: Nutrients, 
    totalServings: number, 
    selectedServings: number
}

export const RecipeNutrientsCalculator = (recipe: RecipeCalculatorProps): Nutrients => {
    const calories: number = recipe.nutrients.calories;
    const totalNutrients: NutrientsProp = recipe.nutrients.totalNutrients;
    const totalDaily: NutrientsProp = recipe.nutrients.totalDaily;
    const totalWeight: number = recipe.nutrients.totalWeight;

    const newCalories: number = calories * recipe.selectedServings / recipe.totalServings;
    const newTotalNutrients: NutrientsProp = Object.fromEntries(
          Object.entries(totalNutrients).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity * recipe.selectedServings / recipe.totalServings,
            unit: value.unit
        }])
    );
    
    const newTotalDaily: NutrientsProp = Object.fromEntries(
        Object.entries(totalDaily).map(([key, value]) => [key, {
            label: value.label,
            quantity: value.quantity * recipe.selectedServings / recipe.totalServings,
            unit: value.unit
        }])
    );
    
    const newTotalWeight: number = totalWeight * recipe.selectedServings / recipe.totalServings;

    return({
        calories: newCalories,
        totalNutrients: newTotalNutrients,
        totalDaily: newTotalDaily,
        totalWeight: newTotalWeight
    });  
};

RecipeNutrientsCalculator;

interface MenuCalculatorProps {
    nutrients: Nutrients, 
    selectedServings: number
}


export const MenuNutrientsCalculator = (recipes: MenuCalculatorProps[]): Nutrients => {
    const recipesNutrients: Nutrients[] = recipes.map((recipe) => { 
        return RecipeNutrientsCalculator({
            nutrients: recipe.nutrients, 
            totalServings: 1, 
            selectedServings: recipe.selectedServings});
    });
    const newCalories: number = recipesNutrients.reduce((acc, curr) => acc + curr.calories, 0);
    const newTotalNutrients: NutrientsProp = recipesNutrients.reduce((acc, curr) => {
        Object.entries(acc).forEach(([key, value]) => {
            value.quantity += curr.totalNutrients[key].quantity;
        });
        return acc;
    }, recipesNutrients[0].totalNutrients);
    const newTotalDaily: NutrientsProp = recipesNutrients.reduce((acc, curr) => {
        Object.entries(acc).forEach(([key, value]) => {
            value.quantity += curr.totalDaily[key].quantity;
        });
        return acc;
    }, recipesNutrients[0].totalDaily);
    const newTotalWeight: number = recipesNutrients.reduce((acc, curr) => acc + curr.totalWeight, 0);

    return({
        calories: newCalories,
        totalNutrients: newTotalNutrients,
        totalDaily: newTotalDaily,
        totalWeight: newTotalWeight
    });
}    