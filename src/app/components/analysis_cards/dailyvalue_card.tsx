import styles from './alanysis_card.module.css';

import { Nutrients } from '@/app/types/types';
import HalfCircle from './utils/half_circle';

interface DailyValueCardProps {
    content: Nutrients | null;
}

const DailyValueCard = ({ content }: DailyValueCardProps): JSX.Element => {

    const calories = content!.totalNutrients.ENERC_KCAL;
    const protein = content!.totalNutrients.PROCNT;
    const carbs = content!.totalNutrients.CHOCDF;
    const fat = content!.totalNutrients.FAT;

    const dailyCalories = content!.totalDaily.ENERC_KCAL;
    const dailyProtein = content!.totalDaily.PROCNT;
    const dailyCarbs = content!.totalDaily.CHOCDF;
    const dailyFat = content!.totalDaily.FAT;

    return (
        <div className={styles.container} style={{gridArea: 'dailyValue'}}>
            <h3 className={styles.title}>Daily Value</h3>
            <div className={styles.daily_grid}>
                <HalfCircle 
                    nutrient={calories} 
                    daily={dailyCalories} 
                    text = 'Calories'
                    color='var(--gray-darker)'
                    lighterColor='var(--gray-lighter)'
                />
                <HalfCircle 
                    nutrient={protein} 
                    daily={dailyProtein} 
                    text = 'Protein'
                    color='var(--primary-color)'
                    lighterColor='var(--primary-light-color)'
                />
                <HalfCircle 
                    nutrient={carbs} 
                    daily={dailyCarbs} 
                    text = 'Carbs'
                    color='var(--secondary-color)'
                    lighterColor='var(--secondary-light-color)'
                />
                <HalfCircle 
                    nutrient={fat} 
                    daily={dailyFat} 
                    text = 'Fat'
                    color='var(--tertiary-color)'
                    lighterColor='var(--tertiary-lightest-plus)'
                />
            </div>
    </div>
    )
}

export default DailyValueCard;