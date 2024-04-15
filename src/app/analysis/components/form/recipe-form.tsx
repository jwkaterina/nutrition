import { useContext, useEffect, useState, useRef } from 'react';
import { useRouter} from 'next/navigation';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { SlideContext } from "@/app/context/slide-context";
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { useRecipeFetch } from '@/app/hooks/recipe-hook';
import { CardState, AnalysisMode, Recipe, StatusType, RecipeWithServings } from '@/app/types/types';
import styles from './form.module.css';

interface RecipeFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void,
    setFile: (file: any) => void
}

const RecipeForm = ({ searchCleared, setClearSearch, setFile }: RecipeFormProps): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { setMessage, setStatus, setIsLoading } = useContext(StatusContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const {sendRequest} = useHttpClient();
    const { fetchRecipeNutrients } = useRecipeFetch();
    const [name, setName] = useState<string>('');
    const [servings, setServings] = useState<number>(1);
    const [ingredientsString, setIngredientsString] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deleteReady, setDeleteReady] =useState<boolean>(false);
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(searchCleared) {
            setCurrentRecipe({
                recipe: null,
                id: null,
                image: null,
                mode: AnalysisMode.VIEW
            });
        }
        setName('');
        setServings(1);
        setIngredientsString('');
        setClearSearch(false);
        setPreviewUrl(null);
        setFile(null);
    }, [searchCleared]);

    useEffect(() => {
        if(currentRecipe.recipe) {
            setName(currentRecipe.recipe.name);
            setServings(currentRecipe.recipe.servings);
            setIngredientsString(currentRecipe.recipe.ingredients.join('\n'));
            setPreviewUrl(currentRecipe.image);
        }
    }, [currentRecipe]);

    const ArrayfromString = (string: string): string[] => {
        return string.split('\n').map((ingredient) => ingredient.trim()).filter((ingredient) => ingredient !== '');
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const ingredientsArray = ArrayfromString(ingredientsString);

        try {
            const nutrients = await fetchRecipeNutrients(ingredientsArray);
            const newRecipe: Recipe = {
                name,
                servings,
                nutrients,
                ingredients: ingredientsArray
            };
            setCurrentRecipe({
                recipe: newRecipe,
                id: currentRecipe.mode === AnalysisMode.EDIT ? currentRecipe.id : null,
                image: previewUrl ? previewUrl : currentRecipe.image,
                mode: currentRecipe.mode
            });
            setCardOpen(CardState.OPEN);
            // at the end of analysis set ingredients state to the formatted string in order to avoid unnecessary re-rendering
            setIngredientsString(ingredientsArray.join('\n'));
        } 
        catch(error) {
            setMessage('Could not analyse recipe. Ensure that all ingredients are spelled correctly and try again.');
        }
    }

    const deleteRecipe = async () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to delete recipe.');
            setIsLoading(false);
            return;
        }
        if(await menusWithRecipe()) return;
        
        try {
            await sendRequest(
                `/recipes/${currentRecipe.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );            
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);            
            setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
            setMessage("Recipe deleted successfully");
            setDeleteReady(false);
        } catch (err) {}
    }

    const menusWithRecipe = async() => {
        if(deleteReady) return false;
    
        const responseData = await sendRequest(
            `/menus`,'GET', null, {
                Authorization: 'Bearer ' + token
            }, true, false
        );
        const menus = () => {
            if (!responseData.menus || !responseData.menus.length) {
                return null; 
            }
            for (const menu of responseData.menus) {
                if (menu.menu.recipes.length > 0) {
                    const matchingRecipe = menu.menu.recipes.find((recipe: RecipeWithServings) => recipe.selectedRecipe.name === currentRecipe.recipe?.name);
                    if (matchingRecipe) {
                        return menu; 
                    }
                }
            }
            //TODO: delete menu
            return null;
        }
        if(!menus()) return false;
    
        setStatus(StatusType.ERROR);
        setMessage('Menus with this recipe will be deleted as well. If you agree press delete button again');
        setDeleteReady(true);
        return true;
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

    const pickedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length === 1) {
            setFile(event.target.files[0]);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result as string);
            };
            fileReader.readAsDataURL(event.target.files[0]);
        }
    };
        
    const pickImageHandler = () => {
        (filePickerRef.current! as HTMLElement).click();
    };

    if(currentRecipe.recipe && cardOpen == CardState.OPEN) {
        return (
            <div className={styles.card_container}>
                <RecipeCard recipe={currentRecipe.recipe} image={currentRecipe.image} index={0} id={null} open={true}/>
            </div> 
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <form aria-label="form" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-name">Recipe Name</label>
                        <input type="text" id="recipe-name" name="recipe-name" required value={name} onInput={e => handleNameInput(e)}/>
                    </div>
                    <div className={styles.form_group}>
                        <input
                            ref={filePickerRef}
                            style={{ display: 'none' }}
                            type="file"
                            accept=".jpg,.png,.jpeg"
                            onChange={pickedHandler}
                        />
                        <button type="button" className={styles.add_button} onClick={pickImageHandler}>{currentRecipe.mode == AnalysisMode.VIEW ? 'Add Image' : 'Change Image'}</button>
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
                    {currentRecipe.mode == AnalysisMode.EDIT && <div className={styles.form_group}>
                        <button type="button" onClick={deleteRecipe}>Delete</button>
                    </div>}
                </form>
            </div>
        </div>
    );
}

export default RecipeForm;