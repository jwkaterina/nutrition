import styles from './alanysis_card.module.css';
import { Nutrient, Nutrients } from '@/app/types/types';
import NutrientRow from './utils/row';

interface BigNutrientsCardProps {
    content: Nutrients | null;
}

const BigNutrientsCard = ({ content }: BigNutrientsCardProps): JSX.Element => {

    const satFat: Nutrient = content!.totalNutrients.FASAT;
    const cholesterol: Nutrient = content!.totalNutrients.CHOLE;
    const fiber: Nutrient = content!.totalNutrients.FIBTG;
    const sugar: Nutrient = content!.totalNutrients.SUGAR;
    const sodium: Nutrient = content!.totalNutrients.NA;

    const dailySatFat: Nutrient = content!.totalDaily.FASAT;
    const dailyCholesterol: Nutrient = content!.totalDaily.CHOLE;
    const dailyFiber: Nutrient = content!.totalDaily.FIBTG;
    const dailySugar: Nutrient = content!.totalDaily.SUGAR;
    const dailySodium: Nutrient = content!.totalDaily.NA;

    return (
        <div className={styles.container}>
            <h3>Big Nutrients</h3>
            <div className={styles.nutrients_container}>
                <NutrientRow
                    title='Satuated fat'
                    color='var(--tertiary-color)'
                    nutrient={satFat}
                    daily={dailySatFat}
                />
                <NutrientRow
                    title='Cholesterol'
                    color='var(--tertiary-color)'
                    nutrient={cholesterol}
                    daily={dailyCholesterol}
                />
                <NutrientRow
                    title='Fiber'
                    color='var(--secondary-color)'
                    nutrient={fiber}
                    daily={dailyFiber}
                />
                <NutrientRow
                    title='Sugar'
                    color='var(--secondary-color)'
                    nutrient={sugar}
                    daily={dailySugar}
                />
                <NutrientRow
                    title='Sodium'
                    color='var(--primary-color)'
                    nutrient={sodium}
                    daily={dailySodium}
                />
            </div>
        </div>
    )
}

export default BigNutrientsCard;

