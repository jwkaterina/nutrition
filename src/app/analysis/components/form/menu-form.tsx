'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import { mutate } from 'swr';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import RecipeSearch from './recipe-search';
import IngredientSearch from './ingredient-search';
import ImagePicker from '@/app/components/utilities/image-picker';
import { combineRecipes } from './utils/combine-recipes';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { SlideContext } from "@/app/context/slide-context";
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { combineIngredientNutrients } from '@/app/hooks/utils/nutrients-calculator';
import { MenuNutrientsCalculator } from '@/app/hooks/utils/nutrients-calculator';
import { CardState, Nutrients, RecipeWithServings, AnalysisMode, StatusType, StructuredIngredient } from '@/app/types/types';
import styles from './form.module.css';

interface MenuFormProps {
    searchCleared: boolean,
    setClearSearch: (clearSearch: boolean) => void,
    file: Blob | null,
    setFile: (file: any) => void,
    imageUrl: string | null,
    setImageUrl: (url: string | null) => void,
}

const MenuForm = ({ searchCleared, setClearSearch, file, setFile, imageUrl, setImageUrl }: MenuFormProps): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setMessage, setStatus, setAction, isLoading } = useContext(StatusContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { sendRequest } = useHttpClient();
    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<StructuredIngredient[]>([]);
    const [legacyIngredients, setLegacyIngredients] = useState<string[]>([]);
    const [currentRecipes, setCurrentRecipes] = useState<RecipeWithServings[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        setIngredients([]);
        setLegacyIngredients([]);
        setClearSearch(false);
        setCurrentRecipes([]);
        setPreviewUrl(null);
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setCurrentRecipes(currentMenu.menu.recipes ?? []);
            // Support both new structured format and legacy string arrays
            const ings = (currentMenu.menu.ingredients ?? []) as any[];
            if (ings.length > 0 && typeof ings[0] === 'object') {
                setIngredients(ings as StructuredIngredient[]);
                setLegacyIngredients([]);
            } else {
                setIngredients([]);
                setLegacyIngredients(ings as string[]);
            }
        }
    }, [currentMenu]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const recipesArray = combineRecipes(currentRecipes);

        const ingredientsPart = ingredients.length > 0
            ? [{ nutrients: combineIngredientNutrients(ingredients), selectedServings: 1 }]
            : [];
        const recipesPart = recipesArray.map(r => ({
            nutrients: r.selectedRecipe.nutrients,
            selectedServings: r.selectedServings
        }));
        const all = [...ingredientsPart, ...recipesPart];

        if (all.length === 0) {
            setStatus(StatusType.ERROR);
            setMessage('Choose at least one recipe or ingredient and try again.');
            return;
        }

        const nutrients: Nutrients = MenuNutrientsCalculator(all);

        const ingredientsToSave = ingredients.length > 0
            ? ingredients
            : (currentMenu.mode === AnalysisMode.EDIT ? (currentMenu.menu?.ingredients ?? []) as StructuredIngredient[] : []);

        const newMenu = {
            name,
            nutrients,
            ingredients: ingredientsToSave,
            recipes: recipesArray
        };
        setCardOpen(CardState.OPEN);
        setCurrentMenu({
            menu: newMenu,
            id: currentMenu.mode == AnalysisMode.EDIT ? currentMenu.id : null,
            mode: currentMenu.mode
        });
    }

    const handleSave = async () => {
        if (!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to save a meal plan.');
            return;
        }
        const recipesArray = combineRecipes(currentRecipes);
        const ingredientsPart = ingredients.length > 0
            ? [{ nutrients: combineIngredientNutrients(ingredients), selectedServings: 1 }]
            : [];
        const recipesPart = recipesArray.map(r => ({
            nutrients: r.selectedRecipe.nutrients,
            selectedServings: r.selectedServings
        }));
        const all = [...ingredientsPart, ...recipesPart];
        if (all.length === 0) {
            setStatus(StatusType.ERROR);
            setMessage('Choose at least one recipe or ingredient and try again.');
            return;
        }
        const nutrients: Nutrients = MenuNutrientsCalculator(all);
        const ingredientsToSave = ingredients.length > 0
            ? ingredients
            : (currentMenu.mode === AnalysisMode.EDIT ? (currentMenu.menu?.ingredients ?? []) as StructuredIngredient[] : []);
        try {
            const formData = new FormData();
            if (currentMenu.mode === AnalysisMode.EDIT && currentMenu.id) {
                const updatedMenu = {
                    name,
                    ingredients: ingredientsToSave,
                    nutrients,
                    recipes: recipesArray.map(r => ({ selectedRecipe: r.selectedRecipeId, selectedServings: r.selectedServings }))
                };
                formData.append('updatedMenu', JSON.stringify(updatedMenu));
                if (file) formData.append('image', file);
                else if (imageUrl) formData.append('imageUrl', imageUrl);
                await sendRequest(`/menus/${currentMenu.id}`, 'PATCH', formData, { Authorization: 'Bearer ' + token });
                setMessage('Meal plan updated.');
            } else {
                const newMenu = {
                    name,
                    ingredients: ingredientsToSave,
                    nutrients,
                    recipes: recipesArray.map(r => ({ selectedRecipe: r.selectedRecipeId, selectedServings: r.selectedServings }))
                };
                formData.append('menu', JSON.stringify(newMenu));
                if (file) formData.append('image', file);
                else if (imageUrl) formData.append('imageUrl', imageUrl);
                await sendRequest('/menus', 'POST', formData, { Authorization: 'Bearer ' + token });
                setMessage('Meal plan saved.');
            }
        } catch (err) {}
    }

    const deleteMenu = async () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to delete meal plan.');
            return;
        }
        const snapshotMenu = currentMenu.menu;
        const snapshotImage = imageUrl;
        try {
            await sendRequest(
                `/menus/${currentMenu.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );
            await mutate(key => Array.isArray(key) && key[0] === '/menus');
            setScrollBehavior('auto');
            router.replace('/?tab=menu');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
            setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
            if (snapshotMenu) {
                setMessage('Meal plan deleted');
                setAction({
                    label: 'Undo',
                    onClick: async () => {
                        try {
                            const recipesForPost = (snapshotMenu.recipes ?? []).map((r: any) => ({
                                selectedRecipe: r.selectedRecipeId ?? r.selectedRecipe,
                                selectedServings: r.selectedServings
                            }));
                            const menuPayload = {
                                name: snapshotMenu.name,
                                ingredients: snapshotMenu.ingredients ?? [],
                                nutrients: snapshotMenu.nutrients,
                                recipes: recipesForPost
                            };
                            const formData = new FormData();
                            formData.append('menu', JSON.stringify(menuPayload));
                            if (snapshotImage) formData.append('imageUrl', snapshotImage);
                            await sendRequest('/menus', 'POST', formData, { Authorization: 'Bearer ' + token });
                            await mutate(key => Array.isArray(key) && key[0] === '/menus');
                            setMessage('Meal plan restored');
                        } catch (err) {}
                    }
                });
            } else {
                setMessage('Meal plan deleted successfully');
            }
        } catch (err) {}
    }

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    if(currentMenu.menu && cardOpen == CardState.OPEN) return (
        <div className={styles.card_container}>
            <MenuCard menu={currentMenu.menu} index={0} id={null} open={true} image={previewUrl}/>
        </div>
    )

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label htmlFor="menu-name">Meal Plan Name</label>
                        <input type="text" id="menu-name" name="menu-name" required value={name} onInput={e => handleNameInput(e)}/>
                    </div>

                    <div className={styles.section_header}>Food</div>
                    <IngredientSearch
                        ingredients={ingredients}
                        onAdd={ing => setIngredients(prev => [...prev, ing])}
                        onRemove={i => setIngredients(prev => prev.filter((_, idx) => idx !== i))}
                        onUpdate={(i, ing) => setIngredients(prev => prev.map((item, idx) => idx === i ? ing : item))}
                        label=""
                        placeholder="e.g. eggs, whole milk…"
                    />
                    {legacyIngredients.length > 0 && (
                        <div className={styles.form_group}>
                            <label>Previous ingredients <span>(for reference — re-add using search above)</span></label>
                            <ul className={styles.legacy_list}>
                                {legacyIngredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className={styles.section_header}>Recipes</div>
                    <RecipeSearch
                        recipes={currentRecipes}
                        onAdd={r => setCurrentRecipes(prev => [...prev, r])}
                        onRemove={i => setCurrentRecipes(prev => prev.filter((_, idx) => idx !== i))}
                        onUpdate={(i, r) => setCurrentRecipes(prev => prev.map((item, idx) => idx === i ? r : item))}
                        label=""
                    />

                    <div className={styles.section_header}>Image</div>
                    {previewUrl ? (
                        <div className={styles.image_preview}>
                            <img src={previewUrl} alt="preview" />
                            <button type="button" className={styles.image_preview_change} onClick={() => { setPreviewUrl(null); setFile(null); setImageUrl(null); }}>✕</button>
                            {isLoading && (
                                <div className={styles.image_preview_overlay} aria-label="Uploading">
                                    <div className={styles.image_preview_spinner} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <ImagePicker
                            availableImages={[
                                ...ingredients.map(i => i.food.food.image),
                                ...currentRecipes.map(r => r.image ?? ''),
                            ].filter(Boolean) as string[]}
                            emptyHint="Or add food and recipes to pick from their images."
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
                        <div className={styles.form_group}>
                            <button type="button" className={styles.add_button} onClick={handleSave}>Save</button>
                        </div>
                        {currentMenu.mode == AnalysisMode.EDIT && <div className={styles.form_group}>
                            <button type="button" className={styles.danger_button} onClick={deleteMenu}>Delete</button>
                        </div>}
                    </div>
                    <button type="button" className={styles.clear_link} onClick={() => { setClearSearch(true); setImageUrl(null); setFile(null); }}>Clear form</button>
                </form>
            </div>
        </div>
    )
}

export default MenuForm;
