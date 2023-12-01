import { useEffect, useRef } from 'react';
import styles from './alanysis_card.module.css';

import { Nutrients } from '@/app/types/types';

interface DailyValueCardProps {
    content: Nutrients | null;
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
                color='#666'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.PROCNT.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.PROCNT.unit} 
                dailyQuantity={content.totalDaily.PROCNT.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.PROCNT.unit} 
                text = 'Protein'
                color='var(--primary-color)'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.CHOCDF.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.CHOCDF.unit} 
                dailyQuantity={content.totalDaily.CHOCDF.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.CHOCDF.unit} 
                text = 'Carbs'
                color='var(--secondary-color)'
            />
            <DailyProgress 
                nutrientsQuantity={content.totalNutrients.FAT.quantity.toFixed(2)} 
                nutrientsUnit={content.totalNutrients.FAT.unit} 
                dailyQuantity={content.totalDaily.FAT.quantity.toFixed(2)} 
                dailyUnit={content.totalDaily.FAT.unit} 
                text = 'Fat'
                color='var(--ertiary-color)'
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

        const progressPercent = circumreference - (dailyQuantity / 100 * circumreference) ;

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: `${progressPercent}` }
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
                <circle  style={styleArc()}  cx="50" cy="50" r={radius} stroke="#ccc" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle className={styles.arc_animation} ref={arcRef} style={styleProgress()}  cx="50" cy="50" r={radius} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <div className={styles.percentage}>
                <p>{`${dailyQuantity} ${dailyUnit}`}</p>
                <h5>{`${nutrientsQuantity} ${nutrientsUnit} ${text}`}</h5>
            </div>
        </div>
    )
}