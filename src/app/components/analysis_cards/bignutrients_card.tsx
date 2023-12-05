import styles from './alanysis_card.module.css';
import { Nutrients } from '@/app/types/types';
import { useEffect, useRef } from 'react';

interface BigNutrientsCardProps {
    content: Nutrients | null;
}

const BigNutrientsCard = ({ content }: BigNutrientsCardProps): JSX.Element => {

    const satFat = content!.totalNutrients.FASAT;
    const cholesterol = content!.totalNutrients.CHOLE;
    const fiber = content!.totalNutrients.FIBTG;
    const sugar = content!.totalNutrients.SUGAR;
    const sodium = content!.totalNutrients.NA;

    const dailySatFat = content!.totalDaily.FASAT;
    const dailyCholesterol = content!.totalDaily.CHOLE;
    const dailyFiber = content!.totalDaily.FIBTG;
    const dailySodium = content!.totalDaily.NA;

    return (
        <div className={styles.container}>
            <h3>Big Nutrients</h3>
            <div className={styles.nutrients_container}>
                {(satFat && dailySatFat) && <NutrientRow
                    title='Satuated fat'
                    color='var(--tertiary-color)'
                    nutrientQuantity={satFat.quantity.toFixed(1)}
                    nutrientUnit={satFat.unit}
                    dailyQuantity={dailySatFat.quantity.toFixed(1)}
                    dailyUnit={dailySatFat.unit}
                />}
                {(cholesterol && dailyCholesterol) && <NutrientRow
                    title='Cholesterol'
                    color='var(--tertiary-color)'
                    nutrientQuantity={cholesterol.quantity.toFixed(1)}
                    nutrientUnit={cholesterol.unit}
                    dailyQuantity={dailyCholesterol.quantity.toFixed(1)}
                    dailyUnit={dailyCholesterol.unit}
                />}
                {(fiber && dailyFiber) && <NutrientRow
                    title='Fiber'
                    color='var(--secondary-color)'
                    nutrientQuantity={fiber.quantity.toFixed(1)}
                    nutrientUnit={fiber.unit}
                    dailyQuantity={dailyFiber.quantity.toFixed(1)}
                    dailyUnit={dailyFiber.unit}
                />}
                {(sugar) && <NutrientRow
                    title='Sugar'
                    color='var(--secondary-color)'
                    nutrientQuantity={sugar.quantity.toFixed(1)}
                    nutrientUnit={sugar.unit}
                    dailyQuantity=''
                    dailyUnit=''
                />}
                {(sodium && dailySodium) && <NutrientRow
                    title='Sodium'
                    color='var(--primary-color)'
                    nutrientQuantity={sodium.quantity.toFixed(1)}
                    nutrientUnit={sodium.unit}
                    dailyQuantity={dailySodium.quantity.toFixed(1)}
                    dailyUnit={dailySodium.unit}
                />}
            </div>
        </div>
    )
}

export default BigNutrientsCard;

interface NutrientRowProps {
    nutrientQuantity: number;
    nutrientUnit: string;
    dailyQuantity: number | string;
    dailyUnit: string;
    title: string;
    color: string;
}

const NutrientRow = ({ title, color, nutrientQuantity, nutrientUnit, dailyQuantity, dailyUnit }: NutrientRowProps): JSX.Element => {

    const lineRef = useRef<SVGLineElement>(null);
    const length = 70;

    useEffect(() => {
        const line = lineRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = () => {
            let progressPercent: number;
            if(dailyQuantity as number <=100 ) progressPercent = length - (dailyQuantity as number / 100 * length) 
            else progressPercent = 0;
            return progressPercent;
        }
        const keyframes: Keyframe[] = [
            { strokeDashoffset: length },
            { strokeDashoffset: `${progressPercent()}` }
        ];

        if(line) {
            lineRef.current.animate(keyframes, options);
        }
    })

    const styleProgress = () => {

        return {
            strokeDasharray: length,
            strokeDashoffset: length,
        }
    }

    const styleLine = () => {

        return {
            strokeDasharray: length,
        }
    }

    return (
        <div className={styles.nutrient_row}>
            <h5 style={{color: color}}>{title}</h5>
            <p>{`${nutrientQuantity} ${nutrientUnit}`}</p>
            <svg width='90px' height='40px'>
                <line x1="10" y1="20" x2="80" y2="20" stroke="#ccc" strokeWidth="6" strokeLinecap="round" style={styleLine()}/> 
                <line x1="10" y1="20" x2="80" y2="20" stroke={color} strokeWidth="6" strokeLinecap="round" style={styleProgress()} ref={lineRef}/> 
            </svg>
            <p>{`${dailyQuantity} ${dailyUnit}`}</p>
        </div>
    )
}

