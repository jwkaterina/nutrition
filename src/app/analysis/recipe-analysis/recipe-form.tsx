import { useContext, useState } from 'react'
import styles from './page.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, Recipe } from '@/app/types/types';
import { analyseRecipe } from '@/app/services/fetch-data';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import { CurrentRecipeContext } from '@/app/context/recipe-context';

interface RecipeFormProps {
}

const RecipeForm = ({ }: RecipeFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const name = form['recipe-name'].value;
        const servings = form['recipe-servings'].value;
        const image = '';
        const ingredients = form['recipe-ingredients'].value.split('\n');

        const nutrients = await analyseRecipe(ingredients);
        const newRecipe = {
            name,
            image,
            servings,
            nutrients,
            ingredients
        };
        setRecipe(newRecipe);
        console.log(nutrients);
        setCardOpen(CardState.OPEN);
        setCurrentRecipe({
            recipe: newRecipe,
            id: null
        });
    }

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    if(recipe && cardOpen == CardState.OPEN) return (
        <RecipeCard recipe={recipe} index={0} id={null} open={true}/>
    )

    return (
        <div className={styles.container} style={style()}>
            <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-name">Recipe Name</label>
                        <input type="text" id="recipe-name" name="recipe-name" required defaultValue={currentRecipe && currentRecipe.recipe?.name}/>
                    </div>
                    <div className={styles.form_group}>
                        <button type="button" className={styles.add_button}>Add Image</button>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-ingredients">Ingredients
                            <span>(Enter each ingredient on a new line)</span>
                        </label>
                        <textarea id="recipe-ingredients" name="recipe-ingredients" required
                        placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} defaultValue={currentRecipe && currentRecipe.recipe?.ingredients.join('\n')}/>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-servings">Number of Servings</label>
                        <input type="number" id="recipe-servings" name="recipe-servings" required min='1' defaultValue={currentRecipe.recipe ? currentRecipe.recipe?.servings : 1}/>
                    </div>
                    <div className={styles.form_group}>
                        <button type="submit">Analyze</button>
                    </div>
            </form>
        </div>
    )
}

export default RecipeForm