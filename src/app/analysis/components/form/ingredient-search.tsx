import { useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, Nutrients, StructuredIngredient } from '@/app/types/types';
import styles from './form.module.css';

const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

interface IngredientSearchProps {
    ingredients: StructuredIngredient[];
    onAdd: (ingredient: StructuredIngredient) => void;
    onRemove: (index: number) => void;
}

const IngredientSearch = ({ ingredients, onAdd, onRemove }: IngredientSearchProps): JSX.Element => {
    const { sendRequest } = useHttpClient();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [measureUri, setMeasureUri] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        setQuantity(1);
        setMeasureUri(food.measures[0]?.uri ?? '');
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
    };

    return (
        <div className={styles.form_group}>
            <label>Ingredients</label>

            {ingredients.length > 0 && (
                <ul className={styles.ingredient_list}>
                    {ingredients.map((ing, i) => (
                        <li key={i} className={styles.ingredient_item}>
                            <span>{ing.quantity} {ing.measureLabel} {ing.food.food.label}</span>
                            <button type="button" className={styles.remove_button} onClick={() => onRemove(i)}>✕</button>
                        </li>
                    ))}
                </ul>
            )}

            {!selectedFood && (
                <div className={styles.ingredient_search_wrap}>
                    <input
                        type="text"
                        placeholder="Search ingredient..."
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
                                <li key={i} onClick={() => handleSelectFood(food)}>
                                    <span>{food.food.label}</span>
                                    <span className={styles.food_kcal}>{Math.round(food.food.nutrients.ENERC_KCAL)} kcal/100g</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
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
                                value={quantity}
                                onInput={e => setQuantity(parseFloat((e.target as HTMLInputElement).value) || 1)}
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
