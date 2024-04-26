import { useEffect } from 'react';
import { LoadedRecipe, RecipeWithServings } from '@/app/types/types';

import styles from './form.module.css';

interface RecipeSelectProps {
    inputs: number,
    setCurrentRecipes: (recipes: RecipeWithServings[]) => void,
    currentRecipes: RecipeWithServings[],
    loadedRecipes: LoadedRecipe[]
}

const RecipeSelect = ({ inputs, currentRecipes, setCurrentRecipes, loadedRecipes }: RecipeSelectProps) => {

    useEffect(() => {
        if (loadedRecipes && loadedRecipes.length > 0) {
            if (inputs > currentRecipes.length) {
                const newRecipes: RecipeWithServings[] = Array(inputs - currentRecipes.length).fill({
                    selectedRecipeId: loadedRecipes[0].id,
                    selectedRecipe: loadedRecipes[0].recipe,
                    selectedServings: 0
                });
                const newRecipesArray: RecipeWithServings[] = [...currentRecipes, ...newRecipes];
                setCurrentRecipes(newRecipesArray);
            }
        }
    }, [inputs, loadedRecipes, currentRecipes.length]);

    const SelectInputs = () => {

        const handleInputChange = (index: number, id: string) => {
            const newRecipe = loadedRecipes.find(recipe => recipe.id === id)!;
            setCurrentRecipes(currentRecipes.map((recipe, i) => i === index ? {
                selectedRecipeId: newRecipe.id,
                selectedRecipe: newRecipe.recipe,
                selectedServings: recipe.selectedServings
            } : recipe));
        }

        let selectInputs = [];
        for(let i = 0; i < inputs; i++) {
            const options = loadedRecipes.map((recipe: LoadedRecipe, index: number) => {
                return (
                    <option key={index} value={recipe.recipe.name}  id={recipe.id}>{recipe.recipe.name}</option>
                );
            });
            selectInputs.push(
                <select 
                    name="recipe"
                    id="recipe" 
                    key={i} 
                    value={currentRecipes[i] && currentRecipes[i].selectedRecipe.name} 
                    onChange={(e) => handleInputChange(i, e.target.options[e.target.selectedIndex].id)}
                >{options}
                </select>);
        };
        return selectInputs;
    }

    const NumberInputs = () => {
 
        const handlePlusClick = (index: number) => {
            setCurrentRecipes(currentRecipes.map((recipe, i) => i === index ? {
                selectedRecipeId: recipe.selectedRecipeId,
                selectedRecipe: recipe.selectedRecipe,
                selectedServings: recipe.selectedServings + 1
            } : recipe));
        };

        const handleMinusClick = (index: number) => {
            if(currentRecipes[index].selectedServings === 0) return;
            setCurrentRecipes(currentRecipes.map((recipe, i) => i === index ? {
                selectedRecipeId: recipe.selectedRecipeId,
                selectedRecipe: recipe.selectedRecipe,
                selectedServings: recipe.selectedServings - 1
            } : recipe));
        };

        let numberInputs = [];
        for(let i = 0; i < inputs; i++) {
            numberInputs.push( 
                <div key={i} className={styles.number_input_group}>
                    <div className={styles.minus_button} onClick={() => handleMinusClick(i)}>-</div>
                    <div className={styles.number} key={i}>{currentRecipes[i] ? currentRecipes[i].selectedServings : 0}</div>
                    <div className={styles.plus_button} onClick={() => handlePlusClick(i)}>+</div>
                </div>
            )
        }
        return numberInputs;
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
    );
}

export default RecipeSelect;