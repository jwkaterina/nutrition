import { useContext, useEffect, useState } from 'react'
import styles from './page.module.css'
import form from '../components/form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';
import { analyseRecipe } from '@/app/services/fetch-data';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import LoadingSpinner from '@/app/components/overlays/loading/loading-spinner';
import ErrorModal from '@/app/components/overlays/error-modal/error-modal';

interface RecipeFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void
}

const RecipeForm = ({ searchCleared, setClearSearch }: RecipeFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const [name, setName] = useState<string>('');
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useState<string>('');
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
        setIngredients('');
        setClearSearch(false);
    }, [searchCleared]);

    useEffect(() => {
        if(currentRecipe.recipe) {
            setName(currentRecipe.recipe.name);
            setServings(currentRecipe.recipe.servings);
            setIngredients(currentRecipe.recipe.ingredients.join('\n'));
        }
    }, [currentRecipe]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const nutrients = await analyseRecipe(ingredients.split('\n'));
            setIsLoading(false);

            const newRecipe = {
                name,
                image: '',
                servings,
                nutrients,
                ingredients: ingredients.split('\n')
            };
            setCardOpen(CardState.OPEN);
            setCurrentRecipe({
                recipe: newRecipe,
                id: null
            });
        } 
        catch(error) {
            setError('Could not analyse recipe. Ensure that all ingredients are spelled correctly and try again.');
            setIsLoading(false);
            throw error;        }
    }

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleIngredientsInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setIngredients(e.currentTarget.value);
    }

    const handleServingsInput = (e: React.FormEvent<HTMLInputElement>) => {
        setServings(parseInt(e.currentTarget.value));
    }

    if(currentRecipe.recipe && cardOpen == CardState.OPEN) return (
        <RecipeCard recipe={currentRecipe.recipe} index={0} id={null} open={true}/>
    )

    return (<>
            {error && <ErrorModal error={error} onClose={() => setError(null)} />}
            {isLoading && <LoadingSpinner />}
            <div className={styles.container} style={style()}>
                <form className={form.form} onSubmit={handleSubmit}>
                        <div className={form.form_group}>
                            <label htmlFor="recipe-name">Recipe Name</label>
                            <input type="text" id="recipe-name" name="recipe-name" required value={name} onInput={e => handleNameInput(e)}/>
                        </div>
                        <div className={form.form_group}>
                            <button type="button" className={form.add_button}>Add Image</button>
                        </div>
                        <div className={form.form_group}>
                            <label htmlFor="recipe-ingredients">Ingredients
                                <span>(Enter each ingredient on a new line)</span>
                            </label>
                            <textarea id="recipe-ingredients" name="recipe-ingredients" required
                            placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredients} onInput={e => handleIngredientsInput(e)}/>
                        </div>
                        <div className={form.form_group}>
                            <label htmlFor="recipe-servings">Number of Servings</label>
                            <input type="number" id="recipe-servings" name="recipe-servings" required min='1' value={servings} onInput={e => handleServingsInput(e)}/>
                        </div>
                        <div className={form.form_group}>
                            <button type="submit">Analyze</button>
                        </div>
                </form>
            </div>
        </>
    )
}

export default RecipeForm