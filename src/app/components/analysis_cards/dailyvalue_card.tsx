import { useEffect, useRef } from 'react';
import styles from './alanysis_card.module.css';

import { Nutrients } from '@/app/types/types';

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
        <div className={styles.container}>
        <h3 className={styles.title}>Daily Value</h3>
        <div className={styles.daily_grid}>
            {(calories && dailyCalories) &&<DailyProgress 
                nutrientsQuantity={calories.quantity.toFixed(0)} 
                nutrientsUnit='' 
                dailyQuantity={dailyCalories.quantity.toFixed(0)} 
                dailyUnit={dailyCalories.unit} 
                text = 'Calories'
                color='var(--gray-darker)'
                lighter-color='var(--gray-lighter)'
            />}
            {(protein && dailyProtein) && <DailyProgress 
                nutrientsQuantity={protein.quantity.toFixed(0)} 
                nutrientsUnit={protein.unit} 
                dailyQuantity={dailyProtein.quantity.toFixed(0)} 
                dailyUnit={dailyProtein.unit} 
                text = 'Protein'
                color='var(--primary-color)'
            />}
            {(carbs && dailyCarbs) && <DailyProgress 
                nutrientsQuantity={carbs.quantity.toFixed(0)} 
                nutrientsUnit={carbs.unit} 
                dailyQuantity={dailyCarbs.quantity.toFixed(0)} 
                dailyUnit={dailyCarbs.unit} 
                text = 'Carbs'
                color='var(--secondary-color)'
            />}
            {(fat && dailyFat) && <DailyProgress 
                nutrientsQuantity={fat.quantity.toFixed(0)} 
                nutrientsUnit={fat.unit} 
                dailyQuantity={dailyFat.quantity.toFixed(0)} 
                dailyUnit={dailyFat.unit} 
                text = 'Fat'
                color='var(--tertiary-color)'
            />}
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
    color: string;
}

const DailyProgress = ({ nutrientsQuantity, nutrientsUnit, dailyQuantity, dailyUnit, text, color }: DailyProgressProps): JSX.Element => {

    const arcRef = useRef<SVGCircleElement>(null);
    const radius = 44;
    const circumreference = radius * 2 * Math.PI;

    useEffect(() => {
        const arc = arcRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = () => {
            let progressPercent: number;
            if(dailyQuantity <=100 ) progressPercent = circumreference - (dailyQuantity / 100 * circumreference / 2) 
            else progressPercent = circumreference / 2;
            return progressPercent;
        }
        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: `${progressPercent()}` }
        ];

        if(arc) {
            arcRef.current.animate(keyframes, options);
        }
    })

    const styleProgress = () => {

        return {
            strokeDasharray: circumreference,
            strokeDashoffset: circumreference,
        }
    }

    const styleArc = () => {

        return {
            strokeDasharray: circumreference / 2,
        }
    }

    return (
        <div className={styles.daily_container}>
            <svg width="100" height="100">
                <circle  style={styleArc()}  cx="50" cy="50" r={radius} stroke="var(--gray-lighter)" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <circle className={styles.arc_animation} ref={arcRef} style={styleProgress()}  cx="50" cy="50" r={radius} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <div className={styles.percentage}>
                <p>{`${dailyQuantity} ${dailyUnit}`}</p>
                <h5>{`${nutrientsQuantity} ${nutrientsUnit} `}<span style={{color: color}}>{text}</span></h5>
            </div>
        </div>
    )
}