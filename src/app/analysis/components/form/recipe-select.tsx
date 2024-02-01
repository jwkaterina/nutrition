import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { LoadedRecipe, RecipeWithServings, NutrientsProp } from '@/app/types/types';
import styles from './form.module.css';
import { create } from 'domain';

interface RecipeSelectProps {
    inputs: number,
    setRecipes: (recipes: RecipeWithServings[]) => void,
    recipes: RecipeWithServings[]
}

const RecipeSelect = ({ inputs, recipes, setRecipes }: RecipeSelectProps) => {

    const { user } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [loadedRecipes, setLoadedRecipes] = useState<LoadedRecipe[]>([]);

    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/recipes/user/${user}`
                );
                setLoadedRecipes(responseData.recipe);
            } catch (err) {}
        };
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (loadedRecipes && loadedRecipes.length > 0) {
            if (inputs > recipes.length) {
                const newRecipes: RecipeWithServings[] = Array(inputs - recipes.length).fill({
                    selectedRecipe: loadedRecipes[0].recipe,
                    selectedServings: 1
                });
                const newRecipesArray: RecipeWithServings[] = [...recipes, ...newRecipes];
                setRecipes(newRecipesArray);
            }
        }
    }, [inputs, loadedRecipes, recipes.length]);

    const SelectInputs = () => {

        const handleInputChange = (index: number, id: string) => {
            undateRecipe(index, id);
        };

        let selectInputs = [];
        for(let i = 0; i < inputs; i++) {
            const options = loadedRecipes.map((recipe: LoadedRecipe, index: number) => {
                return (
                    <option key={index} value={recipe.recipe.name}  id={recipe.id}>{recipe.recipe.name}</option>
                )
            });
            selectInputs.push(<select name="recipe"
            id="recipe" key={i} value={recipes[i] && recipes[i].selectedRecipe.name} onChange={(e) => handleInputChange(i, e.target.options[e.target.selectedIndex].id)}>{options}</select>)
        }
        return selectInputs;
    }

    const NumberInputs = () => {
 
        const handleInputChange = (index: number, newValue: number) => {
            setRecipes(recipes.map((recipe, i) => i === index ? {
                selectedRecipe: recipe.selectedRecipe,
                selectedServings: newValue
            } : recipe));
        };

        let numberInputs = [];
        for(let i = 0; i < inputs; i++) {
            numberInputs.push( <input type="number" id="servings" name="servings" value={recipes[i] ? recipes[i].selectedServings : 1} required min={1} key={i} onChange={(e) => handleInputChange(i, Number(e.target.value))}/>)
        }
        return numberInputs;
    }

    const undateRecipe = async (index: number, id: string) => {
        const newRecipe = loadedRecipes.find(recipe => recipe.id === id)!.recipe;
        const newTotalNutrients: NutrientsProp = Object.fromEntries(
            Object.entries(newRecipe.nutrients.totalNutrients)
                .filter(([key]) => key !== 'id' && key !== '_id')
                .map(([key, value]) => [key, {
                    label: value.label,
                    quantity: value.quantity,
                    unit: value.unit
                }])
        );
        const newTotalDaily: NutrientsProp = Object.fromEntries(
            Object.entries(newRecipe.nutrients.totalDaily)
                .filter(([key]) => key !== 'id' && key !== '_id')
                .map(([key, value]) => [key, {
                    label: value.label,
                    quantity: value.quantity,
                    unit: value.unit
                }])
        );
        setRecipes(recipes.map((recipe, i) => i === index ? {
            selectedRecipe: {
                name: newRecipe.name,
                image: newRecipe.image,
                servings: newRecipe.servings,
                nutrients: {
                    calories: newRecipe.nutrients.calories,
                    totalNutrients: newTotalNutrients,
                    totalDaily: newTotalDaily,
                    totalWeight: newRecipe.nutrients.totalWeight
                },
                ingredients: newRecipe.ingredients
            
            },
            selectedServings: recipe.selectedServings
        } : recipe));
    }

    return (
        <div className={styles.short_inputs_group}>
            <div className={styles.select_group}>
                <label htmlFor="recipes">Recipes</label>
                {SelectInputs()}
            </div>
            <div className={styles.number_group}>
                <label htmlFor="servings">Servings</label>
                {NumberInputs()}
            </div>
        </div>
    )
}

export default RecipeSelect;