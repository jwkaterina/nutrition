import { useEffect, useRef } from 'react';
import { Nutrient } from '@/app/types/types';
import styles from './diagrams.module.css';


interface BarColumnProps {
    nutrient: Nutrient,
    nutrientPercent: Nutrient,
    label: string,
    color: string,
    lightColor: string
}

const BarColumn = ({ nutrient, nutrientPercent, label, color, lightColor }: BarColumnProps): JSX.Element => {    

    const barRef = useRef<HTMLDivElement>(null);

    const barHeight: number = 100;
    let percentHeight: number = 0;
    if(nutrientPercent && nutrientPercent.quantity < 100) percentHeight = nutrientPercent.quantity / 100 * barHeight;
    if(nutrientPercent && nutrientPercent.quantity >= 100) percentHeight = barHeight;


    useEffect(() => {
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        const keyframes: Keyframe[] = [
            { height: 0 },
            { height: `${percentHeight}px` }
        ];

        if(barRef.current) {
            barRef.current.animate(keyframes, options);
        }
    }, [percentHeight]);
    

    if(!nutrient) return <></>;

    return (
        <div className={styles.bar_column}>
            <div className={styles.bar_label}>
                {nutrientPercent ? <span>{`${nutrientPercent.quantity.toFixed(1)}${nutrientPercent.unit}`}</span> : <span>0%</span>}
            </div>   
            <div className={styles.bar} style={{height: `${barHeight}px`, backgroundColor: lightColor}}>
                <div className={styles.percent_bar} ref={barRef} style={{backgroundColor: color}}></div>
            </div>        
            <div className={styles.bar_label}>
                <p>{label}</p>
                <span>{`${nutrient.quantity.toFixed(1)}${nutrient.unit}`}</span>
            </div>                      
        </div>
    );
}

export default BarColumn;