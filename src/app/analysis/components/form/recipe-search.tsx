'use client';
import { useState, useContext } from 'react';
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedRecipe, RecipeWithServings } from '@/app/types/types';
import removeID from './utils/removeID';
import styles from './form.module.css';

interface RecipeSearchProps {
    recipes: RecipeWithServings[];
    onAdd: (recipe: RecipeWithServings) => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, recipe: RecipeWithServings) => void;
    label?: string;
}

const RecipeSearch = ({ recipes, onAdd, onRemove, onUpdate, label = 'Recipes' }: RecipeSearchProps): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [loaded, setLoaded] = useState<LoadedRecipe[] | null>(null);
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<LoadedRecipe | null>(null);
    const [servingsStr, setServingsStr] = useState('1');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const loadRecipes = async () => {
        if (loaded !== null) return;
        try {
            const result = await sendRequest('/recipes', 'GET', null, { Authorization: 'Bearer ' + token }, false, false);
            setLoaded((result.recipe ?? []).map((r: LoadedRecipe) => removeID(r)));
        } catch {}
    };

    const filtered = (loaded ?? []).filter(r =>
        r.recipe.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectRecipe = (r: LoadedRecipe) => {
        setSelectedRecipe(r);
        setQuery('');
        setShowDropdown(false);
        setServingsStr('1');
    };

    const handleAdd = () => {
        if (!selectedRecipe) return;
        const servings = Math.max(1, parseInt(servingsStr) || 1);
        onAdd({
            selectedRecipeId: selectedRecipe.id,
            selectedRecipe: selectedRecipe.recipe,
            selectedServings: servings,
            image: selectedRecipe.image ?? null,
        });
        setSelectedRecipe(null);
        setServingsStr('1');
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setServingsStr(String(recipes[index].selectedServings));
        setSelectedRecipe(null);
        setQuery('');
    };

    const handleUpdate = (index: number) => {
        const r = recipes[index];
        const servings = Math.max(1, parseInt(servingsStr) || 1);
        onUpdate(index, { ...r, selectedServings: servings });
        setEditIndex(null);
    };

    return (
        <div className={styles.form_group}>
            {label && <label>{label}</label>}

            {recipes.length > 0 && (
                <ul className={styles.ingredient_list}>
                    {recipes.map((r, i) => (
                        editIndex === i ? (
                            <li key={i} className={styles.ingredient_edit_inline}>
                                <p className={styles.selected_food_label}>{r.selectedRecipe.name}</p>
                                <div className={styles.number_group}>
                                    <label>Servings</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={servingsStr}
                                        onChange={e => setServingsStr(e.target.value)}
                                    />
                                </div>
                                <div className={styles.ingredient_actions}>
                                    <button type="button" className={styles.add_button} onClick={() => setEditIndex(null)}>Cancel</button>
                                    <button type="button" onClick={() => handleUpdate(i)}>Update</button>
                                </div>
                            </li>
                        ) : (
                            <li key={i} className={styles.ingredient_item}>
                                {r.image
                                    ? <img src={r.image} alt="" className={styles.ingredient_thumb} />
                                    : <div className={styles.ingredient_thumb_placeholder}>{r.selectedRecipe.name[0].toUpperCase()}</div>
                                }
                                <div className={styles.ingredient_text}>
                                    <div className={styles.ingredient_name}>{r.selectedRecipe.name}</div>
                                    <div className={styles.ingredient_amount}>{r.selectedServings} serving{r.selectedServings !== 1 ? 's' : ''}</div>
                                </div>
                                <div className={styles.ingredient_item_actions}>
                                    <button type="button" className={styles.edit_button} onClick={() => handleEdit(i)}>✎</button>
                                    <button type="button" className={styles.remove_button} onClick={() => onRemove(i)}>✕</button>
                                </div>
                            </li>
                        )
                    ))}
                </ul>
            )}

            {!selectedRecipe && editIndex === null && (
                <div
                    className={styles.ingredient_search_wrap}
                    onBlur={e => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setShowDropdown(false);
                            setQuery('');
                        }
                    }}
                >
                    <input
                        type="text"
                        placeholder="Type to filter…"
                        value={query}
                        onFocus={() => { loadRecipes(); setShowDropdown(true); }}
                        onInput={e => setQuery((e.target as HTMLInputElement).value)}
                    />
                    {showDropdown && loaded === null && (
                        <ul className={styles.food_results}>
                            <li style={{ color: 'var(--gray)', pointerEvents: 'none' }}>Loading...</li>
                        </ul>
                    )}
                    {showDropdown && loaded !== null && filtered.length === 0 && (
                        <ul className={styles.food_results}>
                            <li style={{ color: 'var(--gray)', pointerEvents: 'none' }}>No recipes found.</li>
                        </ul>
                    )}
                    {showDropdown && filtered.length > 0 && (
                        <ul className={styles.food_results}>
                            {filtered.map((r, i) => (
                                <li key={i} onMouseDown={() => handleSelectRecipe(r)}>
                                    <span>{r.recipe.name}</span>
                                    <span className={styles.food_kcal}>{r.recipe.servings} serving{r.recipe.servings !== 1 ? 's' : ''}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {selectedRecipe && (
                <div className={styles.ingredient_form}>
                    <p className={styles.selected_food_label}>{selectedRecipe.recipe.name}</p>
                    <div className={styles.number_group}>
                        <label>Servings</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={servingsStr}
                            onChange={e => setServingsStr(e.target.value)}
                        />
                    </div>
                    <div className={styles.ingredient_actions}>
                        <button type="button" className={styles.add_button} onClick={() => setSelectedRecipe(null)}>Cancel</button>
                        <button type="button" onClick={handleAdd}>Add</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeSearch;
