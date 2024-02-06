import { use, useContext, useEffect, useState } from 'react'
import styles from './form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, Nutrients } from '@/app/types/types';
import { analyseRecipe } from '@/app/services/fetch-data';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import LoadingSpinner from '@/app/components/overlays/loading/loading-spinner';
import ErrorModal from '@/app/components/overlays/error-modal/error-modal';
import { RecipeNutrientsCalculator } from './nutrients-calculator';

interface RecipeFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void
}

const RecipeForm = ({ searchCleared, setClearSearch }: RecipeFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const [name, setName] = useState<string>('');
    const [servings, setServings] = useState<number>(1);
    const [ingredientsString, setIngredientsString] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();

    useEffect(() => {
        if(searchCleared) {
            setCurrentRecipe({
                recipe: null,
                id: null
            });
        }
        setName('');
        setServings(1);
        setIngredientsString('');
        setClearSearch(false);
    }, [searchCleared]);

    useEffect(() => {
        if(currentRecipe.recipe) {
            setName(currentRecipe.recipe.name);
            setServings(currentRecipe.recipe.servings);
            setIngredientsString(currentRecipe.recipe.ingredients.join('\n'));
        }
    }, [currentRecipe]);

    const ArrayfromString = (string: string) => {
        return string.split('\n').map((ingredient) => ingredient.trim()).filter((ingredient) => ingredient !== '')
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const ingredientsArray = ArrayfromString(ingredientsString);

        setIsLoading(true);
        try {
           
            const recipeContent: Nutrients = await analyseRecipe(ingredientsArray);
       
            setIsLoading(false);

            const nutrients: Nutrients = RecipeNutrientsCalculator({
                nutrients: recipeContent, 
                totalServings: servings, 
                selectedServings: 1
            });
            const newRecipe = {
                name,
                image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg",
                servings,
                nutrients,
                ingredients: ingredientsArray
            };
            setCurrentRecipe({
                recipe: newRecipe,
                id: null
            });
            setCardOpen(CardState.OPEN);
            // at the end of analysis set ingredients state to the formatted string in order to avoid unnecessary re-rendering
            setIngredientsString(ingredientsArray.join('\n'));
        } 
        catch(error) {
            setError('Could not analyse recipe. Ensure that all ingredients are spelled correctly and try again.');
            setIsLoading(false);
            throw error;        
        }
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleIngredientsInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setIngredientsString(e.currentTarget.value);
    }

    const handleServingsInput = (e: React.FormEvent<HTMLInputElement>) => {
        setServings(parseInt(e.currentTarget.value));
    }

    if(currentRecipe.recipe && cardOpen == CardState.OPEN) {
        return (
        <div className={styles.card_container}>
            <RecipeCard recipe={currentRecipe.recipe} index={0} id={null} open={true}/>
        </div> 
    )}

    return (<>
            {error && <ErrorModal error={error} onClose={() => setError(null)} />}
            {isLoading && <LoadingSpinner />}
            <div className={styles.container}>
                <div className={styles.form_container}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.form_group}>
                            <label htmlFor="recipe-name">Recipe Name</label>
                            <input type="text" id="recipe-name" name="recipe-name" required value={name} onInput={e => handleNameInput(e)}/>
                        </div>
                        <div className={styles.form_group}>
                            <button type="button" className={styles.add_button}>Add Image</button>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="recipe-ingredients">Ingredients
                                <span>(Enter each ingredient on a new line)</span>
                            </label>
                            <textarea id="recipe-ingredients" name="recipe-ingredients" required
                            placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredientsString} onInput={e => handleIngredientsInput(e)}/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="recipe-servings">Number of Servings</label>
                            <input type="number" id="recipe-servings" name="recipe-servings" required min='1' value={servings} onInput={e => handleServingsInput(e)}/>
                        </div>
                        <div className={styles.form_group}>
                            <button type="submit">Analyze</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RecipeForm