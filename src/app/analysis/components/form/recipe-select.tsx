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
                    selectedRecipe: loadedRecipes[0].recipe,
                    selectedServings: 1
                });
                const newRecipesArray: RecipeWithServings[] = [...currentRecipes, ...newRecipes];
                setCurrentRecipes(newRecipesArray);
            }
        }
    }, [inputs, loadedRecipes, currentRecipes.length]);

    const SelectInputs = () => {

        const handleInputChange = (index: number, id: string) => {
            const newRecipe = loadedRecipes.find(recipe => recipe.id === id)!.recipe;
            setCurrentRecipes(currentRecipes.map((recipe, i) => i === index ? {
                selectedRecipe: newRecipe,
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
 
        const handleInputChange = (index: number, newValue: number) => {
            setCurrentRecipes(currentRecipes.map((recipe, i) => i === index ? {
                selectedRecipe: recipe.selectedRecipe,
                selectedServings: newValue
            } : recipe));
        };

        let numberInputs = [];
        for(let i = 0; i < inputs; i++) {
            numberInputs.push( <input type="number" id="servings" name="servings" value={currentRecipes[i] ? currentRecipes[i].selectedServings : 1} required min={1} key={i} onChange={(e) => handleInputChange(i, Number(e.target.value))}/>)
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