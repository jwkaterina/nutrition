import { useContext, useEffect, useState } from 'react'
import styles from './page.module.css'
import form from '../components/form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, LoadedRecipe } from '@/app/types/types';
import { analyseRecipe } from '@/app/services/fetch-data';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { AuthContext } from '@/app/context/auth-context';
import LoadingSpinner from '@/app/components/overlays/loading/loading-spinner';
import ErrorModal from '@/app/components/overlays/error-modal/error-modal';
import { useHttpClient } from '@/app/hooks/http-hook';

interface MenuFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void
}

const MenuForm = ({ searchCleared, setClearSearch }: MenuFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const [recipeList, setRecipeList] = useState<JSX.Element[]>([]);
    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [recipes, setRecipes] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const { user } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/recipes/user/${user}`
                );
                const recipeList = responseData.recipe.map((recipe: LoadedRecipe, index: number) => {
                    return (
                        <option key={index} value={recipe.recipe.name} id={recipe.recipe.name}>{recipe.recipe.name}</option>
                    )
                })
                setRecipeList(recipeList);
            } catch (err) {}
        };
        fetchRecipes();
    }, []);

    useEffect(() => {
        if(searchCleared) {
            setCurrentMenu({
                menu: null,
                id: null
            });
        }
        setName('');
        setIngredients('');
        setClearSearch(false);
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setIngredients(currentMenu.menu.ingredients.join('\n'));
        }
    }, [currentMenu]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const nutrients = await analyseRecipe(ingredients.split('\n'));
            setIsLoading(false);

            const newMenu = {
                name,
                nutrients,
                ingredients: ingredients.split('\n')
            };
            setCardOpen(CardState.OPEN);
            setCurrentMenu({
                menu: newMenu,
                id: null
            });
        } 
        catch(error) {
            setError('Could not analyse menu. Ensure that all ingredients are spelled correctly and try again.');
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

    const handleRecipesInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setRecipes(e.currentTarget.value);
    }

    if(currentMenu.menu && cardOpen == CardState.OPEN) return (
        <MenuCard menu={currentMenu.menu} index={0} id={null} open={true}/>
    )

    return (<>
            {error && <ErrorModal error={error} onClose={() => setError(null)} />}
            {isLoading && <LoadingSpinner />}
            <div className={styles.container} style={style()}>
                <form className={form.form} onSubmit={handleSubmit}>
                        <div className={form.form_group}>
                            <label htmlFor="menu-name">Menu Name</label>
                            <input type="text" id="menu-name" name="menu-name" required value={name} onInput={e => handleNameInput(e)}/>
                        </div>
                        <div className={form.form_group}>
                            <label htmlFor="menu-ingredients">Ingredients
                                <span>(Enter each ingredient on a new line)</span>
                            </label>
                            <textarea id="menu-ingredients" name="menu-ingredients" required
                            placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredients} onInput={e => handleIngredientsInput(e)}/>
                        </div>
                        <RecipeSelect recipes={recipeList}/>
                        <div className={form.form_group}>
                            <button type="button" className={form.add_button}>Add Recipe</button>
                        </div>
                        <div className={form.form_group}>
                            <button type="submit">Analyze</button>
                        </div>
                </form>
            </div>
        </>
    )
}

export default MenuForm

interface RecipeSelectProps {
    recipes: JSX.Element[]
}

const RecipeSelect = ({ recipes }: RecipeSelectProps) => {
    return (<>
        <div className={form.short_inputs_group}>
            <div className={form.select_group}>
                <label htmlFor="recipes">Recipes</label>
                <select 
                    name="recipe" 
                    id="recipe" 
                    // value={recipeList[0]} 
                    // onChange={(e) => handleOptionChange(e)}
                >
                    {recipes}
                </select>
            </div>
            <div className={form.number_group}>
                <label htmlFor="servings">Servings</label>
                <input type="number" id="servings" name="servings" required min={1}
                // value={1} 
                //  onInput={e => handleServings(e)}
                />
            </div>
        </div>
    </>)
}

