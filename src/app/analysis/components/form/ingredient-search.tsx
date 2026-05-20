'use client';
import { useState, useRef, useContext, FormEvent, KeyboardEvent } from 'react';
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from '@/app/context/auth-context';
import { Food, LoadedFood, Nutrients, StructuredIngredient } from '@/app/types/types';
import styles from './form.module.css';

const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

interface IngredientSearchProps {
    ingredients: StructuredIngredient[];
    onAdd: (ingredient: StructuredIngredient) => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, ingredient: StructuredIngredient) => void;
    label?: string;
    placeholder?: string;
}

const IngredientSearch = ({ ingredients, onAdd, onRemove, onUpdate, label = 'Ingredients', placeholder = 'Search ingredient...' }: IngredientSearchProps): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [mode, setMode] = useState<'search' | 'favorites'>('search');
    const [favorites, setFavorites] = useState<LoadedFood[] | null>(null);
    const [favQuery, setFavQuery] = useState('');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [quantityStr, setQuantityStr] = useState<string>('1');
    const [measureUri, setMeasureUri] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFavDropdown, setShowFavDropdown] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadFavorites = async () => {
        if (favorites !== null) return;
        try {
            const result = await sendRequest('/foods', 'GET', null, { Authorization: 'Bearer ' + token });
            setFavorites(result.foods ?? []);
        } catch {}
    };

    const switchMode = (m: 'search' | 'favorites') => {
        setMode(m);
        setSelectedFood(null);
        setFoods([]);
        setQuery('');
        setShowSuggestions(false);
        setShowFavDropdown(false);
        setFavQuery('');
        if (m === 'favorites') loadFavorites();
    };

    const filteredFavorites = (favorites ?? []).filter(f =>
        f.food.food.label.toLowerCase().includes(favQuery.toLowerCase())
    );

    const handleInput = (e: FormEvent) => {
        const value = (e.target as HTMLInputElement).value;
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.length === 0) { setSuggestions([]); setShowSuggestions(false); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                console.log(`[Edamam] autocomplete (ingredient): "${value}"`);
                const result: string[] = await sendRequest(`/api/query/${value}`, 'GET', null, {}, false, false);
                setSuggestions(result);
                setShowSuggestions(true);
            } catch {}
        }, 300);
    };

    const search = async (term: string) => {
        setShowSuggestions(false);
        setFoods([]);
        setSelectedFood(null);
        setQuery(term);
        try {
            console.log(`[Edamam] parseQuery (ingredient): "${term}"`);
            const result = await sendRequest(`/api/ingr/${term}`, 'GET', null, {}, true, false);
            if (result) setFoods(result.hints);
        } catch {}
    };

    const handleSelectFood = (food: Food) => {
        setSelectedFood(food);
        setFoods([]);
        setQuery('');
        setQuantityStr('1');
        setMeasureUri(food.measures[0]?.uri ?? '');
    };

    const handleEdit = (index: number) => {
        const ing = ingredients[index];
        setEditIndex(index);
        setQuantityStr(String(ing.quantity));
        setMeasureUri(ing.measureUri);
        setSelectedFood(null);
        setFoods([]);
        setQuery('');
        setShowSuggestions(false);
    };

    const handleUpdate = (index: number) => {
        const ing = ingredients[index];
        const measure = ing.food.measures.find(m => m.uri === measureUri) ?? ing.food.measures[0];
        const quantity = Math.max(0.01, parseFloat(quantityStr) || 1);
        onUpdate(index, {
            ...ing,
            quantity,
            measureUri: measure.uri,
            measureLabel: measure.label,
            measureWeight: measure.weight,
        });
        setEditIndex(null);
    };

    const handleAdd = async () => {
        if (!selectedFood) return;
        const measure = selectedFood.measures.find(m => m.uri === measureUri) ?? selectedFood.measures[0];

        let nutrients100g: Nutrients | undefined = selectedFood.food.nutrients100g;
        if (!nutrients100g) {
            try {
                console.log(`[Edamam] findNutrients (ingredient): foodId=${selectedFood.food.foodId}`);
                nutrients100g = await sendRequest(
                    `/api/nutrients`, 'POST',
                    JSON.stringify({ foodId: selectedFood.food.foodId, measure: gramUri, quantity: 100 }),
                    { 'Content-Type': 'application/json' }, true, false
                );
            } catch { return; }
        }

        const quantity = Math.max(0.01, parseFloat(quantityStr) || 1);

        onAdd({
            food: { ...selectedFood, food: { ...selectedFood.food, nutrients100g } },
            quantity,
            measureUri: measure.uri,
            measureLabel: measure.label,
            measureWeight: measure.weight,
            nutrients100g: nutrients100g!,
        });

        setSelectedFood(null);
        setSuggestions([]);
        setShowFavDropdown(false);
        setFavQuery('');
    };

    return (
        <div className={styles.form_group}>
            <label>{label}</label>

            {ingredients.length > 0 && (
                <ul className={styles.ingredient_list}>
                    {ingredients.map((ing, i) => (
                        editIndex === i ? (

                            <li key={i} className={styles.ingredient_edit_inline}>
                                <p className={styles.selected_food_label}>{ing.food.food.label}</p>
                                <div className={styles.short_inputs_group}>
                                    <div className={styles.number_group}>
                                        <label>Quantity</label>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={quantityStr}
                                            onChange={e => setQuantityStr(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.select_group}>
                                        <label>Measure</label>
                                        <select value={measureUri} onChange={e => setMeasureUri(e.target.value)}>
                                            {ing.food.measures.map((m, j) => (
                                                <option key={j} value={m.uri}>{m.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.ingredient_actions}>
                                    <button type="button" className={styles.add_button} onClick={() => setEditIndex(null)}>Cancel</button>
                                    <button type="button" onClick={() => handleUpdate(i)}>Update</button>
                                </div>
                            </li>
                        ) : (
                            <li key={i} className={styles.ingredient_item}>
                                <div>
                                    <div className={styles.ingredient_name}>{ing.food.food.label}</div>
                                    <div className={styles.ingredient_amount}>{ing.quantity} {ing.measureLabel}</div>
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

            {!selectedFood && editIndex === null && (
                <>
                    <div className={styles.mode_toggle}>
                        <button type="button"
                            className={mode === 'search' ? `${styles.mode_btn} ${styles.mode_btn_active}` : styles.mode_btn}
                            onClick={() => switchMode('search')}>Search</button>
                        <button type="button"
                            className={mode === 'favorites' ? `${styles.mode_btn} ${styles.mode_btn_active}` : styles.mode_btn}
                            onClick={() => switchMode('favorites')}>Favorites</button>
                    </div>

                    {mode === 'search' && (
                        <div
                            className={styles.ingredient_search_wrap}
                            onBlur={e => {
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                    setShowSuggestions(false);
                                    setFoods([]);
                                    setQuery('');
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={query}
                                onInput={handleInput}
                                onKeyUp={(e: KeyboardEvent) => { if (e.key === 'Enter' && query) search(query); }}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className={styles.suggestions}>
                                    {suggestions.map((s, i) => (
                                        <li key={i} onMouseDown={() => search(s)}>{s}</li>
                                    ))}
                                </ul>
                            )}
                            {foods.length > 0 && (
                                <ul className={styles.food_results}>
                                    {foods.map((food, i) => (
                                        <li key={i} onMouseDown={() => handleSelectFood(food)}>
                                            <span>{food.food.label}</span>
                                            <span className={styles.food_kcal}>{Math.round(food.food.nutrients.ENERC_KCAL)} kcal/100g</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {mode === 'favorites' && (
                        <div
                            className={styles.ingredient_search_wrap}
                            onBlur={e => {
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                    setShowFavDropdown(false);
                                    setFavQuery('');
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Filter favorites..."
                                value={favQuery}
                                onFocus={() => setShowFavDropdown(true)}
                                onInput={e => setFavQuery((e.target as HTMLInputElement).value)}
                            />
                            {showFavDropdown && favorites === null && (
                                <ul className={styles.food_results}>
                                    <li style={{ color: 'var(--gray)', pointerEvents: 'none' }}>Loading...</li>
                                </ul>
                            )}
                            {showFavDropdown && favorites !== null && filteredFavorites.length === 0 && (
                                <ul className={styles.food_results}>
                                    <li style={{ color: 'var(--gray)', pointerEvents: 'none' }}>No favorites found.</li>
                                </ul>
                            )}
                            {showFavDropdown && filteredFavorites.length > 0 && (
                                <ul className={styles.food_results}>
                                    {filteredFavorites.map((f, i) => (
                                        <li key={i} onMouseDown={() => handleSelectFood(f.food)}>
                                            <span>{f.food.food.label}</span>
                                            <span className={styles.food_kcal}>{Math.round(f.food.food.nutrients.ENERC_KCAL)} kcal/100g</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            )}

            {selectedFood && (
                <div className={styles.ingredient_form}>
                    <p className={styles.selected_food_label}>{selectedFood.food.label}</p>
                    <div className={styles.short_inputs_group}>
                        <div className={styles.number_group}>
                            <label>Quantity</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={quantityStr}
                                onChange={e => setQuantityStr(e.target.value)}
                            />
                        </div>
                        <div className={styles.select_group}>
                            <label>Measure</label>
                            <select value={measureUri} onChange={e => setMeasureUri(e.target.value)}>
                                {selectedFood.measures.map((m, i) => (
                                    <option key={i} value={m.uri}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.ingredient_actions}>
                        <button type="button" className={styles.add_button} onClick={() => setSelectedFood(null)}>Cancel</button>
                        <button type="button" onClick={handleAdd}>Add</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientSearch;
