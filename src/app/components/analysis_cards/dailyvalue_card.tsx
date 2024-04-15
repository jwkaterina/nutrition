import HalfCircle from './figures/half_circle';
import { Nutrients, Nutrient } from '@/app/types/types';
import styles from './alanysis_card.module.css';

interface DailyValueCardProps {
    content: Nutrients | null;
}

const DailyValueCard = ({ content }: DailyValueCardProps): JSX.Element => {

    const calories: Nutrient = content!.totalNutrients.ENERC_KCAL;
    const protein: Nutrient = content!.totalNutrients.PROCNT;
    const carbs: Nutrient = content!.totalNutrients.CHOCDF;
    const fat: Nutrient = content!.totalNutrients.FAT;

    const dailyCalories: Nutrient = content!.totalDaily.ENERC_KCAL;
    const dailyProtein: Nutrient = content!.totalDaily.PROCNT;
    const dailyCarbs: Nutrient = content!.totalDaily.CHOCDF;
    const dailyFat: Nutrient = content!.totalDaily.FAT;

    return (
        <div className={styles.container} style={{gridArea: 'dailyValue'}}>
            <h3 className={styles.title}>Daily Value</h3>
            <div className={styles.daily_grid}>
                <HalfCircle 
                    nutrient={calories} 
                    daily={dailyCalories} 
                    text = 'Calories'
                    color='var(--gray-darker)'
                    lighterColor='var(--gray-light)'
                    radius={44}
                    strokeWidth={6}
                    centerX={50}
                    centerY={50}
                />
                <HalfCircle 
                    nutrient={protein} 
                    daily={dailyProtein} 
                    text = 'Protein'
                    color='var(--primary-color)'
                    lighterColor='var(--primary-light-color)'
                    radius={30}
                    strokeWidth={4}
                    centerX={32}
                    centerY={18}
                />
                <HalfCircle 
                    nutrient={carbs} 
                    daily={dailyCarbs} 
                    text = 'Carbs'
                    color='var(--secondary-color)'
                    lighterColor='var(--secondary-light-color)'
                    radius={30}
                    strokeWidth={4}
                    centerX={32}
                    centerY={18}
                />
                <HalfCircle 
                    nutrient={fat} 
                    daily={dailyFat} 
                    text = 'Fat'
                    color='var(--tertiary-color)'
                    lighterColor='var(--tertiary-lightest-plus)'
                    radius={30}
                    strokeWidth={4}
                    centerX={32}
                    centerY={18}
                />
            </div>
        </div>
    );
}

export default DailyValueCard;