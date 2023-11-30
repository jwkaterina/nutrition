import styles from './alanysis_card.module.css';

import { Nutrients } from '@/app/types/types';

interface DailyValueCardProps {
    content: Nutrients
}

const DailyValueCard = ({ content }: DailyValueCardProps): JSX.Element => {
    if(!content) return <></>
    return (
        <div className={styles.container}>
        <h3 className={styles.title}>Daily Value</h3>
        <div className={styles.daily_grid}>
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.ENERC_KCAL.quantity.toFixed(2)} 
                nutrientsUnit='' 
                dailyQuantity={content.totalDaily.ENERC_KCAL.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.ENERC_KCAL.unit} 
                text = 'Calories'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.PROCNT.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.PROCNT.unit} 
                dailyQuantity={content.totalDaily.PROCNT.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.PROCNT.unit} 
                text = 'Protein'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.CHOCDF.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.CHOCDF.unit} 
                dailyQuantity={content.totalDaily.CHOCDF.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.CHOCDF.unit} 
                text = 'Carbs'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.FAT.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.FAT.unit} 
                dailyQuantity={content.totalDaily.FAT.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.FAT.unit} 
                text = 'Fat'
            />
        </div>
    </div>
    )
}

export default DailyValueCard;

interface DailyProgressProps {
    nutrientsQuantity: number;
    nutrientsUnit: string;
    dailyQuantity: number;
    dailyUnit: string;
    text: string;
}

const DailyProgress = ({ nutrientsQuantity, nutrientsUnit, dailyQuantity, dailyUnit, text }: DailyProgressProps): JSX.Element => {
    return (
        <div className={styles.total}>
        <div className={styles.progress}>
            <div className={styles.inner_circle}>
                <div className={styles.percentage}>
                    <p>{`${dailyQuantity} ${dailyUnit}`}</p>
                    <h5>{`${nutrientsQuantity} ${nutrientsUnit} ${text}`}</h5>
                </div>
            </div>
        </div>
    </div>
    )
}