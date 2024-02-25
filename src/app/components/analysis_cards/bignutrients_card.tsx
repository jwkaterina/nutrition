import BarRow from './utils/bar_row';
import { Nutrient, Nutrients } from '@/app/types/types';
import styles from './alanysis_card.module.css';

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
        <div className={styles.container} style={{gridArea: 'bigNutrients'}}>
            <h3 className={styles.title}>Big Nutrients</h3>
            <div>
                <BarRow
                    title='Satuated fat'
                    color='var(--tertiary-color)'
                    nutrient={satFat}
                    daily={dailySatFat}
                />
                <BarRow
                    title='Cholesterol'
                    color='var(--tertiary-color)'
                    nutrient={cholesterol}
                    daily={dailyCholesterol}
                />
                <BarRow
                    title='Fiber'
                    color='var(--secondary-color)'
                    nutrient={fiber}
                    daily={dailyFiber}
                />
                <BarRow
                    title='Sugar'
                    color='var(--secondary-color)'
                    nutrient={sugar}
                    daily={dailySugar}
                />
                <BarRow
                    title='Sodium'
                    color='var(--primary-color)'
                    nutrient={sodium}
                    daily={dailySodium}
                />
            </div>
        </div>
    );
}

export default BigNutrientsCard;

