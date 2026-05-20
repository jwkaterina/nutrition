'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';
import IngredientSearch from './ingredient-search';
import ImagePicker from '@/app/components/utilities/image-picker';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { SlideContext } from "@/app/context/slide-context";
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { combineIngredientNutrients } from '@/app/hooks/utils/nutrients-calculator';
import { CardState, AnalysisMode, Recipe, StatusType, StructuredIngredient } from '@/app/types/types';
import styles from './form.module.css';

interface RecipeFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void,
    setFile: (file: any) => void,
    setImageUrl: (url: string | null) => void,
}

const RecipeForm = ({ searchCleared, setClearSearch, setFile, setImageUrl }: RecipeFormProps): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { setMessage, setStatus, setIsLoading } = useContext(StatusContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { sendRequest } = useHttpClient();
    const [name, setName] = useState<string>('');
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useState<StructuredIngredient[]>([]);
    const [legacyIngredients, setLegacyIngredients] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deleteReady, setDeleteReady] = useState<boolean>(false);
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
        setIngredients([]);
        setLegacyIngredients([]);
        setClearSearch(false);
        setPreviewUrl(null);
        setFile(null);
    }, [searchCleared]);

    useEffect(() => {
        if(currentRecipe.recipe) {
            setName(currentRecipe.recipe.name);
            setServings(currentRecipe.recipe.servings);
            // Support both new structured format and legacy string arrays
            const ings = currentRecipe.recipe.ingredients as any[];
            if (ings.length > 0 && typeof ings[0] === 'object') {
                setIngredients(ings as StructuredIngredient[]);
                setLegacyIngredients([]);
            } else {
                setIngredients([]);
                setLegacyIngredients(ings as string[]);
            }
            setPreviewUrl(currentRecipe.image);
        }
    }, [currentRecipe]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let nutrients;
        if (ingredients.length > 0) {
            nutrients = combineIngredientNutrients(ingredients);
        } else if (currentRecipe.mode === AnalysisMode.EDIT && currentRecipe.recipe?.nutrients) {
            nutrients = currentRecipe.recipe.nutrients;
        } else {
            setStatus(StatusType.ERROR);
            setMessage('Add at least one ingredient.');
            return;
        }

        const newRecipe: Recipe = {
            name,
            servings,
            nutrients,
            ingredients
        };
        setCurrentRecipe({
            recipe: newRecipe,
            id: currentRecipe.mode === AnalysisMode.EDIT ? currentRecipe.id : null,
            image: previewUrl ? previewUrl : currentRecipe.image,
            mode: currentRecipe.mode
        });
        setCardOpen(CardState.OPEN);
    }

    const deleteRecipe = async () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to delete recipe.');
            setIsLoading(false);
            return;
        }
        if(!confirmed()) return;

        try {
            await sendRequest(
                `/recipes/${currentRecipe.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );
            setScrollBehavior('auto');
            router.replace('/?tab=recipe');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
            setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
            setMessage("Recipe deleted successfully");
            setDeleteReady(false);
        } catch (err) {}
    }

    const confirmed = () => {
        if(deleteReady) return true;

        setStatus(StatusType.ERROR);
        setMessage('Menus with this recipe will be modified. If you agree press delete button again');
        setDeleteReady(true);
        return false;
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const handleServingsInput = (e: React.FormEvent<HTMLInputElement>) => {
        setServings(parseInt(e.currentTarget.value));
    }

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
                    <div className={styles.two_col}>
                        <div className={styles.form_group}>
                            <label htmlFor="recipe-name">Recipe Name</label>
                            <input type="text" id="recipe-name" name="recipe-name" required value={name} onInput={e => handleNameInput(e)}/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="recipe-servings">Servings</label>
                            <input type="number" id="recipe-servings" name="recipe-servings" required min='1' value={servings} onInput={e => handleServingsInput(e)}/>
                        </div>
                    </div>

                    <div className={styles.section_header}>Ingredients</div>
                    <IngredientSearch
                        ingredients={ingredients}
                        onAdd={ing => setIngredients(prev => [...prev, ing])}
                        onRemove={i => setIngredients(prev => prev.filter((_, idx) => idx !== i))}
                        onUpdate={(i, ing) => setIngredients(prev => prev.map((item, idx) => idx === i ? ing : item))}
                        label=""
                    />
                    {legacyIngredients.length > 0 && (
                        <div className={styles.form_group}>
                            <label>Previous ingredients <span>(for reference — re-add using search above)</span></label>
                            <ul className={styles.legacy_list}>
                                {legacyIngredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className={styles.section_header}>Image</div>
                    {previewUrl ? (
                        <div className={styles.image_preview}>
                            <img src={previewUrl} alt="preview" />
                            <button type="button" aria-label="Change image" className={styles.image_preview_change} onClick={() => { setPreviewUrl(null); setFile(null); setImageUrl(null); }}>✕</button>
                        </div>
                    ) : (
                        <ImagePicker
                            availableImages={ingredients.map(i => i.food.food.image).filter(Boolean) as string[]}
                            selectedUrl={previewUrl}
                            onFile={file => {
                                setFile(file);
                                const reader = new FileReader();
                                reader.onload = () => setPreviewUrl(reader.result as string);
                                reader.readAsDataURL(file);
                            }}
                            onUrl={url => {
                                setPreviewUrl(url);
                                setFile(null);
                                setImageUrl(url);
                            }}
                        />
                    )}

                    <div className={styles.form_actions_row}>
                        <div className={styles.form_group}>
                            <button type="submit">Analyze</button>
                        </div>
                        {currentRecipe.mode == AnalysisMode.EDIT && <div className={styles.form_group}>
                            <button type="button" className={styles.danger_button} onClick={deleteRecipe}>Delete</button>
                        </div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RecipeForm;
