'use client';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/auth-context';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, FoodType, StatusType } from '@/app/types/types';
import styles from './form.module.css';

interface ManualFoodFormProps {
    onSaved: () => void;
}

const ManualFoodForm = ({ onSaved }: ManualFoodFormProps): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { setMessage, setStatus } = useContext(StatusContext);
    const { sendRequest } = useHttpClient();

    const [name, setName] = useState('');
    const [category, setCategory] = useState<FoodType>(FoodType.GENERIC_FOODS);
    const [kcal, setKcal] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fiber, setFiber] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add food.');
            return;
        }

        const food: Food = {
            food: {
                foodId: `manual_${Date.now()}`,
                label: name,
                image: '',
                category,
                categoryLabel: 'food',
                knownAs: name,
                nutrients: {
                    ENERC_KCAL: Number(kcal),
                    PROCNT: Number(protein),
                    FAT: Number(fat),
                    CHOCDF: Number(carbs),
                    FIBTG: Number(fiber) || 0
                },
                nutrients100g: {
                    calories: Number(kcal),
                    totalWeight: 100,
                    totalNutrients: {
                        ENERC_KCAL: { label: 'Energy', quantity: Number(kcal), unit: 'kcal' },
                        PROCNT: { label: 'Protein', quantity: Number(protein), unit: 'g' },
                        FAT: { label: 'Total lipid (fat)', quantity: Number(fat), unit: 'g' },
                        CHOCDF: { label: 'Carbohydrate, by difference', quantity: Number(carbs), unit: 'g' },
                        FIBTG: { label: 'Fiber, total dietary', quantity: Number(fiber) || 0, unit: 'g' },
                    },
                    totalDaily: {}
                }
            },
            measures: [{
                uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
                label: 'Gram',
                weight: 1
            }]
        };

        try {
            await sendRequest('/foods', 'POST', JSON.stringify({ food }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            });
            setStatus(StatusType.SUCCESS);
            setMessage('Food added to favorites.');
            onSaved();
        } catch (err) {}
    };

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <form aria-label="form" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label htmlFor="food-name">Food Name</label>
                        <input
                            type="text"
                            id="food-name"
                            required
                            value={name}
                            onInput={e => setName((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.select_group}>
                        <label htmlFor="food-category">Category</label>
                        <select
                            id="food-category"
                            value={category}
                            onChange={e => setCategory(e.target.value as FoodType)}
                        >
                            <option value={FoodType.GENERIC_FOODS}>Generic foods</option>
                            <option value={FoodType.PACKAGED_FOODS}>Packaged foods</option>
                            <option value={FoodType.GENERIC_MEALS}>Generic meals</option>
                            <option value={FoodType.FAST_FOODS}>Fast foods</option>
                        </select>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="food-kcal">Calories per 100g (kcal)</label>
                        <input
                            type="number"
                            id="food-kcal"
                            required
                            min="0"
                            value={kcal}
                            onInput={e => setKcal((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="food-protein">Protein per 100g (g)</label>
                        <input
                            type="number"
                            id="food-protein"
                            required
                            min="0"
                            value={protein}
                            onInput={e => setProtein((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="food-fat">Fat per 100g (g)</label>
                        <input
                            type="number"
                            id="food-fat"
                            required
                            min="0"
                            value={fat}
                            onInput={e => setFat((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="food-carbs">Carbs per 100g (g)</label>
                        <input
                            type="number"
                            id="food-carbs"
                            required
                            min="0"
                            value={carbs}
                            onInput={e => setCarbs((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="food-fiber">Fiber per 100g (g) <span>optional</span></label>
                        <input
                            type="number"
                            id="food-fiber"
                            min="0"
                            value={fiber}
                            onInput={e => setFiber((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <button type="submit">Save to Favorites</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualFoodForm;
