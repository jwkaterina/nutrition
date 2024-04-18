import BarRow from './diagrams/bar-row';
import { Nutrient, Nutrients } from '@/app/types/types';
import styles from './alanysis-card.module.css';

interface BigNutrientsCardProps {
    content: Nutrients | null;
}

const BigNutrientsCard = ({ content }: BigNutrientsCardProps): JSX.Element => {

    const satFat: Nutrient | undefined = content?.totalNutrients.FASAT;
    const cholesterol: Nutrient | undefined = content?.totalNutrients.CHOLE;
    const fiber: Nutrient | undefined = content?.totalNutrients.FIBTG;
    const sugar: Nutrient | undefined = content?.totalNutrients.SUGAR;
    const sodium: Nutrient | undefined = content?.totalNutrients.NA;

    const dailySatFat: Nutrient | undefined = content?.totalDaily.FASAT;
    const dailyCholesterol: Nutrient | undefined = content?.totalDaily.CHOLE;
    const dailyFiber: Nutrient | undefined = content?.totalDaily.FIBTG;
    const dailySugar: Nutrient | undefined = content?.totalDaily.SUGAR;
    const dailySodium: Nutrient | undefined = content?.totalDaily.NA;

    if(!satFat && !cholesterol && !fiber && !sugar && !sodium) return (
        <div className={styles.container} style={{gridArea: 'bigNutrients'}}>
            <h3 className={styles.title}>Big Nutrients</h3>
            <div className={styles.infl}>No information available.</div>
        </div>
    )

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

