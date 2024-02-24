import { useContext, useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import RecipeSelect from './recipe-select';
import { MenuNutrientsCalculator, RecipeNutrientsCalculator } from './nutrients-calculator';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { SlideContext } from "@/app/context/slide-context";
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { CardState, Nutrients, RecipeWithServings, AnalysisMode, StatusType } from '@/app/types/types';
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
    const {sendRequest} = useHttpClient();
    const [name, setName] = useState<string>('');
    const [ingredientsString, setIngredientsString] = useState<string>('');
    const [recipes, setRecipes] = useState<RecipeWithServings[]>([]);
    const [inputsnumber, setInputsnumber] = useState<number>(0);

    const router = useRouter();

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
        setRecipes([]);
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setIngredientsString(currentMenu.menu.ingredients.join('\n'));
            setInputsnumber(currentMenu.menu.recipes.length);
            setRecipes(currentMenu.menu.recipes);
        }
    }, [currentMenu]);

    const ArrayfromString = (string: string): string[] => {
        return string.split('\n').map((ingredient) => ingredient.trim()).filter((ingredient) => ingredient !== '');
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const ingredientsArray = ArrayfromString(ingredientsString);
        const nutrients: Nutrients | null = await calculateNutrients(ingredientsArray);

        if(nutrients) {
            const newMenu = {
                name,
                nutrients: nutrients,
                ingredients: ingredientsArray,
                recipes: recipes
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

    const calculateNutrients = async (ingredientsArray: string[]): Promise<Nutrients | null> => {
        const recipesArr = recipes.map((recipe) => { 
            return {
                nutrients: recipe.selectedRecipe.nutrients,
                selectedServings: recipe.selectedServings
            };
        })
        if(ingredientsArray && ingredientsArray.length > 0) {
            const ingredientsNutrients = await fetchNutrients(ingredientsArray);
                if(ingredientsNutrients) recipesArr.push({
                    nutrients: ingredientsNutrients,
                    selectedServings: 1
                }); 
        }
        if(recipesArr.length > 0) {
            const nutrients: Nutrients = MenuNutrientsCalculator(recipesArr);
            return nutrients;
        } else {
            setStatus(StatusType.ERROR);
            setMessage('Could not analyse menu. Choose at least one recipe or ingredient and try again.');
            return null;
        }
    }

    const fetchNutrients = async(ingredientsArray: string[]): Promise<Nutrients> => {
        try {
            const ingredientsContent: Nutrients = await sendRequest(
                `http://localhost:5001/api/recipe`,
                'POST',
                JSON.stringify({
                    ingredients: ingredientsArray
                }),
                { 'Content-Type': 'application/json' }
            );
            const ingredientsNutrients: Nutrients = RecipeNutrientsCalculator({
                nutrients: ingredientsContent, 
                totalServings: 1, 
                selectedServings: 1
            });
            return ingredientsNutrients;
        } catch (error) {
            setMessage('Could not analyse menu. Ensure that all ingredients are spelled correctly and try again.');
            throw error;
        }
    }

    const deleteMenu = async () => {
        try {
            await sendRequest(
                `http://localhost:5001/menus/${currentMenu.id}`,
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

    const handleAddRecipe = () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You need to be logged in to add a recipe');
            return;
        }
        setInputsnumber(inputsnumber + 1);
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
                    <RecipeSelect inputs={inputsnumber} setRecipes={setRecipes} recipes={recipes}/>
                    <div className={styles.form_group}>
                        <button type="button" className={styles.add_button} onClick={handleAddRecipe}>Add Recipe</button>
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

