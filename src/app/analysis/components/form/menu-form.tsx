'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';
import RecipeSearch from './recipe-search';
import IngredientSearch from './ingredient-search';
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
    setClearSearch: (clearSearch: boolean) => void
}

const MenuForm = ({ searchCleared, setClearSearch }: MenuFormProps): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setMessage, setStatus } = useContext(StatusContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { sendRequest } = useHttpClient();
    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<StructuredIngredient[]>([]);
    const [legacyIngredients, setLegacyIngredients] = useState<string[]>([]);
    const [currentRecipes, setCurrentRecipes] = useState<RecipeWithServings[]>([]);

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
    }, [searchCleared]);

    useEffect(() => {
        if(currentMenu.menu) {
            setName(currentMenu.menu.name);
            setCurrentRecipes(currentMenu.menu.recipes);
            // Support both new structured format and legacy string arrays
            const ings = currentMenu.menu.ingredients as any[];
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

        const newMenu = {
            name,
            nutrients,
            ingredients,
            recipes: recipesArray
        };
        setCardOpen(CardState.OPEN);
        setCurrentMenu({
            menu: newMenu,
            id: currentMenu.mode == AnalysisMode.EDIT ? currentMenu.id : null,
            mode: currentMenu.mode
        });
    }

    const deleteMenu = async () => {
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to delete menu.');
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
            router.replace('/?tab=menu');
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
                    <IngredientSearch
                        ingredients={ingredients}
                        onAdd={ing => setIngredients(prev => [...prev, ing])}
                        onRemove={i => setIngredients(prev => prev.filter((_, idx) => idx !== i))}
                        onUpdate={(i, ing) => setIngredients(prev => prev.map((item, idx) => idx === i ? ing : item))}
                        label="Food"
                        placeholder="Search food..."
                    />
                    {legacyIngredients.length > 0 && (
                        <div className={styles.form_group}>
                            <label>Previous ingredients <span>(for reference — re-add using search above)</span></label>
                            <ul className={styles.legacy_list}>
                                {legacyIngredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                    )}
                    <RecipeSearch
                        recipes={currentRecipes}
                        onAdd={r => setCurrentRecipes(prev => [...prev, r])}
                        onRemove={i => setCurrentRecipes(prev => prev.filter((_, idx) => idx !== i))}
                        onUpdate={(i, r) => setCurrentRecipes(prev => prev.map((item, idx) => idx === i ? r : item))}
                    />
                    <div className={styles.form_actions_row}>
                        <div className={styles.form_group}>
                            <button type="submit">Analyze</button>
                        </div>
                        {currentMenu.mode == AnalysisMode.EDIT && <div className={styles.form_group}>
                            <button type="button" className={styles.danger_button} onClick={deleteMenu}>Delete</button>
                        </div>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MenuForm;
