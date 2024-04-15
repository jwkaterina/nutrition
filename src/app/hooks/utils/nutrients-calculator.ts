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
        Object.entries(totalNutrients).map(([key, value]) => {
            return [key, {
                label: value.label,
                quantity: value.quantity * recipe.selectedServings / recipe.totalServings,
                unit: value.unit
            }];
        })
    );
    
    const newTotalDaily: NutrientsProp = Object.fromEntries(
        Object.entries(totalDaily).map(([key, value]) => {
            return [key, {
                label: value.label,
                quantity: value.quantity * recipe.selectedServings / recipe.totalServings,
                unit: value.unit
            }];
        })
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

export interface MenuCalculatorProps {
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
    const newTotalNutrients: NutrientsProp = recipesNutrients.map((value) => value.totalNutrients).reduce((acc, curr) => {
        const updatedNutrients: NutrientsProp = {};
        Object.entries(acc).forEach(([key, value]) => {
            if (curr[key]) {
                updatedNutrients[key] = {
                    ...value,
                    quantity: value.quantity + curr[key].quantity
                };
            };
        });
        return updatedNutrients;
    });
    const newTotalDaily: NutrientsProp = recipesNutrients.map((value) => value.totalDaily).reduce((acc, curr) => {
        const updatedNutrients: NutrientsProp = {};
        Object.entries(acc).forEach(([key, value]) => {
            if (curr[key]) {
                updatedNutrients[key] = {
                    ...value,
                    quantity: value.quantity + curr[key].quantity
                };
            };
        });
        return updatedNutrients;
    });

    const newTotalWeight: number = recipesNutrients.reduce((acc, curr) => acc + curr.totalWeight, 0);

    return({
        calories: newCalories,
        totalNutrients: newTotalNutrients,
        totalDaily: newTotalDaily,
        totalWeight: newTotalWeight
    });
}    