'use client';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '@/app/context/auth-context';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, FoodType, Nutrients, NutrientsProp, StatusType } from '@/app/types/types';
import styles from './form.module.css';

interface ManualFoodFormProps {
    onSaved: () => void;
    topPad?: string;
}

const DV: Record<string, number> = {
    ENERC_KCAL: 2000, PROCNT: 50, FAT: 78, CHOCDF: 275, FIBTG: 28,
    SUGAR: 50, NA: 2300, FASAT: 20, CHOLE: 300,
    VITA_RAE: 900, VITC: 90, VITD: 20, TOCPHA: 15, VITK1: 120,
    THIA: 1.2, RIBF: 1.3, NIA: 16, VITB6A: 1.7,
    FOLDFE: 400, FOLFD: 400, FOLAC: 400, VITB12: 2.4,
    CA: 1300, MG: 420, K: 4700, FE: 18, ZN: 11, P: 1250, MG2: 420,
};

const NUTRIENT_META: Record<string, { label: string; unit: string }> = {
    ENERC_KCAL: { label: 'Energy', unit: 'kcal' },
    PROCNT:     { label: 'Protein', unit: 'g' },
    FAT:        { label: 'Total lipid (fat)', unit: 'g' },
    CHOCDF:     { label: 'Carbohydrate, by difference', unit: 'g' },
    FIBTG:      { label: 'Fiber, total dietary', unit: 'g' },
    SUGAR:      { label: 'Sugars, total', unit: 'g' },
    NA:         { label: 'Sodium, Na', unit: 'mg' },
    FASAT:      { label: 'Fatty acids, total saturated', unit: 'g' },
    FATRN:      { label: 'Fatty acids, total trans', unit: 'g' },
    FAMS:       { label: 'Fatty acids, total monounsaturated', unit: 'g' },
    FAPU:       { label: 'Fatty acids, total polyunsaturated', unit: 'g' },
    CHOLE:      { label: 'Cholesterol', unit: 'mg' },
    VITA_RAE:   { label: 'Vitamin A, RAE', unit: 'µg' },
    VITC:       { label: 'Vitamin C, total ascorbic acid', unit: 'mg' },
    VITD:       { label: 'Vitamin D (D2 + D3)', unit: 'µg' },
    TOCPHA:     { label: 'Vitamin E (alpha-tocopherol)', unit: 'mg' },
    VITK1:      { label: 'Vitamin K (phylloquinone)', unit: 'µg' },
    THIA:       { label: 'Thiamin', unit: 'mg' },
    RIBF:       { label: 'Riboflavin', unit: 'mg' },
    NIA:        { label: 'Niacin', unit: 'mg' },
    VITB6A:     { label: 'Vitamin B-6', unit: 'mg' },
    FOLDFE:     { label: 'Folate, DFE', unit: 'µg' },
    FOLFD:      { label: 'Folate, food', unit: 'µg' },
    FOLAC:      { label: 'Folic acid', unit: 'µg' },
    VITB12:     { label: 'Vitamin B-12', unit: 'µg' },
    CA:         { label: 'Calcium, Ca', unit: 'mg' },
    MG:         { label: 'Magnesium, Mg', unit: 'mg' },
    K:          { label: 'Potassium, K', unit: 'mg' },
    FE:         { label: 'Iron, Fe', unit: 'mg' },
    ZN:         { label: 'Zinc, Zn', unit: 'mg' },
    P:          { label: 'Phosphorus, P', unit: 'mg' },
};

const ManualFoodForm = ({ onSaved, topPad }: ManualFoodFormProps): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { setMessage, setStatus } = useContext(StatusContext);
    const { sendRequest } = useHttpClient();

    const [name, setName] = useState('');
    const [category, setCategory] = useState<FoodType>(FoodType.GENERIC_FOODS);
    const [fields, setFields] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const filePickerRef = useRef<HTMLInputElement | null>(null);

    const set = (key: string, val: string) =>
        setFields(prev => ({ ...prev, [key]: val }));

    const num = (key: string) => Number(fields[key]) || 0;
    const has = (key: string) => fields[key] !== undefined && fields[key] !== '';

    const buildNutrients100g = (): Nutrients => {
        const totalNutrients: NutrientsProp = {};
        const totalDaily: NutrientsProp = {};

        const add = (key: string) => {
            if (!has(key)) return;
            const qty = num(key);
            const meta = NUTRIENT_META[key];
            totalNutrients[key] = { label: meta.label, quantity: qty, unit: meta.unit };
            const dv = DV[key];
            if (dv) {
                totalDaily[key] = { label: meta.label, quantity: qty / dv * 100, unit: '%' };
            }
        };

        Object.keys(NUTRIENT_META).forEach(add);

        return {
            calories: num('ENERC_KCAL'),
            totalWeight: 100,
            totalNutrients,
            totalDaily,
        };
    };

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
                    ENERC_KCAL: num('ENERC_KCAL'),
                    PROCNT: num('PROCNT'),
                    FAT: num('FAT'),
                    CHOCDF: num('CHOCDF'),
                    FIBTG: num('FIBTG'),
                },
                nutrients100g: buildNutrients100g(),
            },
            measures: [{
                uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
                label: 'Gram',
                weight: 1,
            }],
        };

        try {
            const formData = new FormData();
            formData.append('food', JSON.stringify(food));
            if (imageFile) formData.append('image', imageFile);
            await sendRequest('/foods', 'POST', formData, {
                Authorization: 'Bearer ' + token,
            });
            setStatus(StatusType.SUCCESS);
            setMessage('Food added to favorites.');
            onSaved();
        } catch (err) {}
    };

    const pickedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length === 1) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const Field = ({ id, label, unit, required }: { id: string; label: string; unit: string; required?: boolean }) => (
        <div className={styles.form_group}>
            <label htmlFor={id}>{label} <span>({unit}){required ? '' : ' — optional'}</span></label>
            <input
                type="number"
                id={id}
                min="0"
                required={required}
                value={fields[id] ?? ''}
                onInput={e => set(id, (e.target as HTMLInputElement).value)}
            />
        </div>
    );

    return (
        <div className={styles.container} style={topPad ? { paddingTop: topPad } : undefined}>
            <div className={`${styles.form_container} ${styles.form_container_wide}`}>
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
                    <div className={styles.form_group}>
                        <input
                            ref={filePickerRef}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            onChange={pickedHandler}
                        />
                        <button type="button" className={styles.add_button} onClick={() => filePickerRef.current?.click()}>
                            {previewUrl ? 'Change Image' : 'Add Image'}
                        </button>
                        {previewUrl && (
                            <img src={previewUrl} alt="preview" style={{ marginTop: '0.5rem', maxHeight: '8rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
                        )}
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

                    <h3 className={styles.section_header}>Macronutrients <span>per 100g</span></h3>
                    <div className={styles.two_col}>
                        <Field id="ENERC_KCAL" label="Calories" unit="kcal" required />
                        <Field id="PROCNT" label="Protein" unit="g" required />
                        <Field id="FAT" label="Fat" unit="g" required />
                        <Field id="CHOCDF" label="Carbohydrates" unit="g" required />
                    </div>

                    <h3 className={styles.section_header}>Big Nutrients <span>per 100g</span></h3>
                    <div className={styles.two_col}>
                        <Field id="FASAT" label="Saturated Fat" unit="g" />
                        <Field id="FATRN" label="Trans Fat" unit="g" />
                        <Field id="FAMS" label="Monounsaturated Fat" unit="g" />
                        <Field id="FAPU" label="Polyunsaturated Fat" unit="g" />
                        <Field id="CHOLE" label="Cholesterol" unit="mg" />
                        <Field id="FIBTG" label="Fiber" unit="g" />
                        <Field id="SUGAR" label="Sugar" unit="g" />
                        <Field id="NA" label="Sodium" unit="mg" />
                    </div>

                    <h3 className={styles.section_header}>Vitamins <span>per 100g</span></h3>
                    <div className={styles.two_col}>
                        <Field id="VITA_RAE" label="Vitamin A" unit="µg" />
                        <Field id="VITC" label="Vitamin C" unit="mg" />
                        <Field id="VITD" label="Vitamin D" unit="µg" />
                        <Field id="TOCPHA" label="Vitamin E" unit="mg" />
                        <Field id="VITK1" label="Vitamin K" unit="µg" />
                        <Field id="THIA" label="Thiamin (B1)" unit="mg" />
                        <Field id="RIBF" label="Riboflavin (B2)" unit="mg" />
                        <Field id="NIA" label="Niacin (B3)" unit="mg" />
                        <Field id="VITB6A" label="Vitamin B6" unit="mg" />
                        <Field id="FOLDFE" label="Folate DFE" unit="µg" />
                        <Field id="FOLFD" label="Folate food" unit="µg" />
                        <Field id="FOLAC" label="Folic Acid" unit="µg" />
                        <Field id="VITB12" label="Vitamin B12" unit="µg" />
                    </div>

                    <h3 className={styles.section_header}>Minerals <span>per 100g</span></h3>
                    <div className={styles.two_col}>
                        <Field id="CA" label="Calcium" unit="mg" />
                        <Field id="MG" label="Magnesium" unit="mg" />
                        <Field id="K" label="Potassium" unit="mg" />
                        <Field id="FE" label="Iron" unit="mg" />
                        <Field id="ZN" label="Zinc" unit="mg" />
                        <Field id="P" label="Phosphorus" unit="mg" />
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
