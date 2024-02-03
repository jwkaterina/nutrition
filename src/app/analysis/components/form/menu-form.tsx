import { useContext, useEffect, useState } from 'react'
import styles from './form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, Nutrients, RecipeWithServings } from '@/app/types/types';
import { analyseRecipe } from '@/app/services/fetch-data';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import { CurrentMenuContext } from '@/app/context/menu-context';
import LoadingSpinner from '@/app/components/overlays/loading/loading-spinner';
import ErrorModal from '@/app/components/overlays/error-modal/error-modal';
import RecipeSelect from './recipe-select';
import { MenuNutrientsCalculator, RecipeNutrientsCalculator } from './nutrients-calculator';

interface MenuFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void
}

const MenuForm = ({ searchCleared, setClearSearch }: MenuFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const [name, setName] = useState<string>('');
    const [ingredientsString, setIngredientsString] = useState<string>('');
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

    const ArrayfromString = (string: string) => {
        return string.split('\n').map((ingredient) => ingredient.trim()).filter((ingredient) => ingredient !== '')
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const ingredientsArray = ArrayfromString(ingredientsString);
            const nutrients: Nutrients = await fetchNutrients(ingredientsArray);
            setIsLoading(false);

            const newMenu = {
                name,
                nutrients: nutrients,
                ingredients: ingredientsArray,
                recipes: recipes
            };
            setCardOpen(CardState.OPEN);
            setCurrentMenu({
                menu: newMenu,
                id: null
            });
            // at the end of analysis set ingredients state to the formatted string in order to avoid unnecessary re-rendering
            setIngredientsString(ingredientsArray.join('\n'));
        } 
        catch(error) {
            setError('Could not analyse menu. Ensure that all ingredientsString are spelled correctly and try again.');
            setIsLoading(false);
            throw error;        
        }
    }

    const fetchNutrients = async (ingredientsArray: string[]): Promise<Nutrients> => {
        const recipesArr = recipes.map((recipe) => { 
            return {
            nutrients: recipe.selectedRecipe.nutrients,
            selectedServings: recipe.selectedServings
        }})
        if(ingredientsArray && ingredientsArray.length > 0) {
            const ingredientsContent = await analyseRecipe(ingredientsArray);
            const ingredientsNutrients: Nutrients = RecipeNutrientsCalculator({
                nutrients: ingredientsContent, 
                totalServings: 1, 
                selectedServings: 1
            });
            recipesArr.push({
                nutrients: ingredientsNutrients,
                selectedServings: 1
            }); 
        }
        const nutrients: Nutrients = MenuNutrientsCalculator(recipesArr);
        return nutrients;
    }


    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleIngredientsInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setIngredientsString(e.currentTarget.value);
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
                            <textarea id="menu-ingredients" name="menu-ingredients"
                            placeholder={'1 cup rice' + '\n' + '10 oz chickpeas' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'} value={ingredientsString} onInput={e => handleIngredientsInput(e)}/>
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

