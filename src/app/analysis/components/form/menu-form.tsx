import { useContext, useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import RecipeSelect from './recipe-select';
import SmallSpinner from '@/app/components/utilities/loading/small-spinner';
import removeID from './utils/removeID';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { SlideContext } from "@/app/context/slide-context";
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { useMenuFetch } from '@/app/hooks/menu-hook';
import { CardState, Nutrients, RecipeWithServings, AnalysisMode, StatusType, LoadedRecipe } from '@/app/types/types';
import styles from './form.module.css';

interface MenuFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void
}

const MenuForm = ({ searchCleared, setClearSearch }: MenuFormProps): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setMessage, setStatus } = useContext(StatusContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { sendRequest } = useHttpClient();
    const { fetchMenuNutrients } = useMenuFetch(); 
    const [name, setName] = useState<string>('');
    const [ingredientsString, setIngredientsString] = useState<string>('');
    const [currentRecipes, setCurrentRecipes] = useState<RecipeWithServings[]>([]);
    const [loadedRecipes, setLoadedRecipes] = useState<LoadedRecipe[]>([]);
    const [inputsnumber, setInputsnumber] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const fetchRecipes = async() => {
        try {
            setIsLoading(true);
            const responseData = await sendRequest(
                `/recipes`, 'GET', null, {
                    Authorization: 'Bearer ' + token
                }, false, false
            );
            setIsLoading(false);
            const recipes = responseData.recipe.map((recipe: LoadedRecipe) => removeID(recipe));
            if(recipes.length == 0) {
                setStatus(StatusType.ERROR);
                setMessage('You do not have any favorite recipes.');
            } else {
                setLoadedRecipes(recipes);
                setInputsnumber(inputsnumber + 1);
            }
        } catch (err) {
            setIsLoading(false);
            setMessage('Could not find recipes');
        }
    }

    useEffect(() => {
        if(searchCleared) {
            setCurrentMenu({
                menu: null,
                id: null,
                mode: AnalysisMode.VIEW
            });
        }
        setName('');
        setIngredientsString('');
        setClearSearch(false);
        setInputsnumber(0);
        setCurrentRecipes([]);
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setIngredientsString(currentMenu.menu.ingredients.join('\n'));
            setInputsnumber(currentMenu.menu.recipes.length);
            setCurrentRecipes(currentMenu.menu.recipes);
        }
        if(currentMenu.menu && currentMenu.mode == AnalysisMode.EDIT && currentMenu.menu.recipes.length > 0) fetchRecipes();
    }, [currentMenu]);

    const ArrayfromString = (string: string): string[] => {
        return string.split('\n').map((ingredient) => ingredient.trim()).filter((ingredient) => ingredient !== '');
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const ingredientsArray = ArrayfromString(ingredientsString);
        const nutrients: Nutrients | null = await fetchMenuNutrients(ingredientsArray, currentRecipes);

        if(nutrients) {
            const newMenu = {
                name,
                nutrients: nutrients,
                ingredients: ingredientsArray,
                recipes: currentRecipes
            };
            setCardOpen(CardState.OPEN);
            setCurrentMenu({
                menu: newMenu,
                id: currentMenu.mode == AnalysisMode.EDIT ? currentMenu.id : null,
                mode: currentMenu.mode
            });
            // at the end of analysis set ingredients state to the formatted string in order to avoid unnecessary re-rendering
            setIngredientsString(ingredientsArray.join('\n'));
        }
    }

    const deleteMenu = async () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to delete menu.');
            setIsLoading(false);
            return;
        }
        try {
            await sendRequest(
                `/menus/${currentMenu.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);            
            setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
            setMessage("Menu deleted successfully");
        } catch (err) {}
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleIngredientsInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setIngredientsString(e.currentTarget.value);
    }

    const handleAddRecipe = async() => {
        console.log(loadedRecipes);
        console.log(currentRecipes);
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You need to be logged in to add a recipe');
            return;
        }
        fetchRecipes();
    }

    if(currentMenu.menu && cardOpen == CardState.OPEN) return (
        <div className={styles.card_container}>
            <MenuCard menu={currentMenu.menu} index={0} id={null} open={true}/>
        </div>
    )

    return (
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
                        <textarea id="menu-ingredients" name="menu-ingredients"
                        placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredientsString} onInput={e => handleIngredientsInput(e)}/>
                    </div>
                    <RecipeSelect 
                        inputs={inputsnumber} 
                        setCurrentRecipes={setCurrentRecipes} 
                        currentRecipes={currentRecipes} 
                        loadedRecipes={loadedRecipes}
                    />
                    <div className={styles.form_group}>
                        <button type="button" className={styles.add_button} onClick={handleAddRecipe}>Add Recipe</button>
                        {isLoading && <SmallSpinner/>}
                    </div>
                    <div className={styles.form_group}>
                        <button type="submit">Analyze</button>
                    </div>
                    {currentMenu.mode == AnalysisMode.EDIT && <div className={styles.form_group}>
                        <button type="button" onClick={deleteMenu}>Delete</button>
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default MenuForm;

