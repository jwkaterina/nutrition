import { useContext, useEffect, useState, useRef } from 'react'
import styles from './form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, LoadedRecipe, Recipe } from '@/app/types/types';
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

    interface RecipeWithServings {
        selectedRecipe: Recipe,
        selectedServings: number
    }

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const [loadedRecipes, setLoadedRecipes] = useState<LoadedRecipe[]>([]);
    const [recipeSelect, setRecipeSelect] = useState<JSX.Element[]>([]);
    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [recipes, setRecipes] = useState<RecipeWithServings[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const { user } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [inputsnumber, setInputsnumber] = useState<number>(0);


    const [submitted, setSubmitted] = useState<boolean>(false);


    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/recipes/user/${user}`
                );
                const loadedRecipes = responseData.recipe.map((recipe: LoadedRecipe, index: number) => {
                    return (
                        <option key={index} value={recipe.recipe.name} id={recipe.id}>{recipe.recipe.name}</option>
                    )
                })
                setRecipeSelect(loadedRecipes);
                setLoadedRecipes(responseData.recipe);
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

        setSubmitted(true);
        if(!recipesReady) {
            return;
        }

        setIsLoading(true);
        try {
            const nutrients = await analyseRecipe(ingredients.split('\n'));
            setIsLoading(false);

            const newMenu = {
                name,
                nutrients,
                ingredients: ingredients.split('\n'),
                recipes: recipes!
            };
            console.log(newMenu);
            setCardOpen(CardState.OPEN);
            setCurrentMenu({
                menu: newMenu,
                id: null
            });
        } 
        catch(error) {
            setError('Could not analyse menu. Ensure that all ingredients are spelled correctly and try again.');
            setIsLoading(false);
            throw error;        
        }
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleIngredientsInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setIngredients(e.currentTarget.value);
    }

    if(currentMenu.menu && cardOpen == CardState.OPEN) return (
        <div className={styles.card_container}>
            <MenuCard menu={currentMenu.menu} index={0} id={null} open={true}/>
        </div>
    )

    return (<>
            {error && <ErrorModal error={error} onClose={() => setError(null)} />}
            {isLoading && <LoadingSpinner />}
            <div className={styles.container}>
                <div className={styles.form_container}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.form_group}>
                            <label htmlFor="menu-name">Menu Name</label>
                            <input type="text" id="menu-name" name="menu-name" required value={name} onInput={e => handleNameInput(e)}/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="menu-ingredients">Ingredients
                                <span>(Enter each ingredient on a new line)</span>
                            </label>
                            <textarea id="menu-ingredients" name="menu-ingredients" required
                            placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredients} onInput={e => handleIngredientsInput(e)}/>
                        </div>
                        <RecipeSelect recipeSelect={recipeSelect} inputs={inputsnumber} loadedRecipes={loadedRecipes} submitted={submitted} setRecipes={setRecipes}/>
                        <div className={styles.form_group}>
                            <button type="button" className={styles.add_button} onClick={() => setInputsnumber(inputsnumber + 1)}>Add Recipe</button>
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

export default MenuForm

interface RecipeSelectProps {
    recipeSelect: JSX.Element[],
    inputs: number,
    loadedRecipes: LoadedRecipe[],
    submitted: boolean,
    setRecipes: (recipes: RecipeWithServings[]) => void
}

const RecipeSelect = ({ recipeSelect, inputs, loadedRecipes, submitted, setRecipes }: RecipeSelectProps) => {

    let servings: HTMLInputElement[] = [];
    let selects: HTMLSelectElement[] = [];


    useEffect(() => {
        if(!submitted) {
            return;
        }
        const selectedRecipes: any[] = [];
        
        selects.forEach((select) => {
            const id = select.children[select.selectedIndex].id;
            const newRecipe = loadedRecipes.find(recipe => recipe.id === id)!.recipe;
            const recipeWithServings = {
                selectedRecipe: newRecipe,
                selectedServings: 0 // Initialize with 0, will be updated in the next loop
            };
            selectedRecipes.push(recipeWithServings);
        });
        servings.forEach((serving, index) => {
            selectedRecipes[index].selectedServings = parseInt((serving as HTMLInputElement).value);
        });
        setRecipes(selectedRecipes);
    }, [submitted ]);

    const SelectInputs = () => {
        let selectInputs = [];
        for(let i = 0; i < inputs; i++) {
            selectInputs.push(<select name="recipe" 
            id="recipe" key={i} ref={(element) => selects.push(element!)}>{recipeSelect}</select>)
        }
        return selectInputs;
    }

    const NumberInputs = () => {
        let numberInputs = [];
        for(let i = 0; i < inputs; i++) {
            numberInputs.push( <input type="number" id="servings" name="servings" required min={1} key={i} ref={(element) => servings.push(element!)}/>)
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
    )
}

