import { useContext, useEffect, useState, useRef, use } from 'react'
import styles from './form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, LoadedRecipe, RecipeWithServings } from '@/app/types/types';
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
    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [recipes, setRecipes] = useState<RecipeWithServings[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const [inputsnumber, setInputsnumber] = useState<number>(0);

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
        setInputsnumber(0);
        setRecipes([]);
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setIngredients(currentMenu.menu.ingredients.join('\n'));
            setInputsnumber(currentMenu.menu.recipes.length);
            setRecipes(currentMenu.menu.recipes);
        }
    }, [currentMenu]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            // const nutrients = await analyseRecipe(ingredients.split('\n'));
            setIsLoading(false);

            const newMenu = {
                name,
                nutrients: [],
                ingredients: ingredients.split('\n'),
                recipes: recipes
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
            {/* <MenuCard menu={currentMenu.menu} index={0} id={null} open={true}/> */}
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
                        <RecipeSelect inputs={inputsnumber} setRecipes={setRecipes} recipes={recipes}/>
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
            const newValue = loadedRecipes.find(recipe => recipe.id === id)!.recipe;
            setRecipes(recipes.map((recipe, i) => i === index ? {
                selectedRecipe: newValue,
                selectedServings: recipe.selectedServings
            } : recipe));
        };

        let selectInputs = [];
        for(let i = 0; i < inputs; i++) {
            const options = loadedRecipes.map((recipe: LoadedRecipe, index: number) => {
                return (
                    <option key={index} value={recipe.recipe.name} selected={recipes[i] && recipe.recipe.name == recipes[i].selectedRecipe.name} id={recipe.id}>{recipe.recipe.name}</option>
                )
            });
            selectInputs.push(<select name="recipe"
            id="recipe" key={i} onChange={(e) => handleInputChange(i, e.target.options[e.target.selectedIndex].id)}>{options}</select>)
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
            numberInputs.push( <input type="number" id="servings" name="servings" value={recipes[i] && recipes[i].selectedServings} required min={1} key={i} onChange={(e) => handleInputChange(i, Number(e.target.value))}/>)
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

