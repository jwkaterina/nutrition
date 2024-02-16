import { useContext, useEffect, useState, useRef } from 'react'
import styles from './form.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState, Nutrients, AnalysisMode } from '@/app/types/types';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { StatusContext } from '@/app/context/status-context';
import { RecipeNutrientsCalculator } from './nutrients-calculator';
import { useHttpClient } from '@/app/hooks/http-hook';
import { useRouter} from 'next/navigation';
import { SlideContext } from "@/app/context/slide-context";

interface RecipeFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void,
    setFile: (file: any) => void
}

const RecipeForm = ({ searchCleared, setClearSearch, setFile }: RecipeFormProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const [name, setName] = useState<string>('');
    const [servings, setServings] = useState<number>(1);
    const [ingredientsString, setIngredientsString] = useState<string>('');
    const { setMessage } = useContext(StatusContext);
    const {sendRequest} = useHttpClient();
    const { setScrollBehavior } = useContext(SlideContext);

    const router = useRouter();

    useEffect(() => {
        if(searchCleared) {
            setCurrentRecipe({
                recipe: null,
                id: null,
                mode: AnalysisMode.VIEW
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

        try {
            const recipeContent: Nutrients = await sendRequest(
                `http://localhost:5001/api/recipe`,
                'POST',
                JSON.stringify({
                    ingredients: ingredientsArray
                }),
                { 'Content-Type': 'application/json' }
            );
       
            const nutrients: Nutrients = RecipeNutrientsCalculator({
                nutrients: recipeContent, 
                totalServings: servings, 
                selectedServings: 1
            });
            const newRecipe = {
                name,
                servings,
                nutrients,
                ingredients: ingredientsArray
            };
            setCurrentRecipe({
                recipe: newRecipe,
                id: currentRecipe.mode === AnalysisMode.EDIT ? currentRecipe.id : null,
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
        try {
            await sendRequest(
                `http://localhost:5001/recipes/${currentRecipe.id}`,
                'DELETE'
            );            
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);            
            setCardOpen(CardState.CLOSED);
            setCurrentRecipe({id: null, recipe: null, mode: AnalysisMode.VIEW});
            setMessage("Recipe deleted successfully");
        } catch (err) {
            setMessage('Could not delete recipe. Try again later.');
            throw err;
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

    const filePickerRef = useRef();
    const [previewUrl, setPreviewUrl] = useState<string>();

    // useEffect(() => {
    //     if (!file) {
    //         return;
    //     }
    //     const fileReader = new FileReader();
    //     fileReader.onload = () => {
    //     setPreviewUrl(fileReader.result);
    //     };
    //     fileReader.readAsDataURL(file);
    // }, [file]);

    const pickedHandler = event => {
        if (event.target.files && event.target.files.length === 1) {
            setFile(event.target.files[0]);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(event.target.files[0]);
            console.log(fileReader.result)
        }
    };
        
    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    if(currentRecipe.recipe && cardOpen == CardState.OPEN) {
        return (
        <div className={styles.card_container}>
            <RecipeCard recipe={currentRecipe.recipe} image={previewUrl} index={0} id={null} open={true}/>
        </div> 
    )}

    return (<>
            <div className={styles.container}>
                <div className={styles.form_container}>
                    <form className={styles.form} onSubmit={handleSubmit}>
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
                            {/* <div>
                                <div>
                                {previewUrl && <img src={previewUrl} alt="Preview" />}
                                {!previewUrl && <p>Please pick an image.</p>}
                                </div>
                            </div> */}
                            <button type="button" className={styles.add_button} onClick={pickImageHandler}>Add Image</button>
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
                            <button onClick={deleteRecipe}>Delete</button>
                        </div>}
                    </form>
                </div>
            </div>
        </>
    )
}

export default RecipeForm