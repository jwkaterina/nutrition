import styles from './utils.module.css'
import { Nutrient } from '@/app/types/types'
import { useEffect, useRef } from 'react'

interface BarColumnProps {
    vitamin: Nutrient,
    vitaminPercent: Nutrient,
    label: string,
    color: string,
    lightColor: string
}

const BarColumn = ({ vitamin, vitaminPercent, label, color, lightColor }: BarColumnProps): JSX.Element => {

    const barHeight = 100;
    let percentHeight = 0;
    if(vitaminPercent && vitaminPercent.quantity < 100) percentHeight = vitaminPercent.quantity / 100 * barHeight;
    if(vitaminPercent && vitaminPercent.quantity >= 100) percentHeight = barHeight;

    const barRef = useRef<HTMLDivElement>(null);

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
    })
    

    if(!vitamin) return <></>

    return <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`, backgroundColor: lightColor}}>
                    <div className={styles.percent_bar} ref={barRef} style={{backgroundColor: color}}></div>
                </div>        
                <div className={styles.bar_label}>
                    <p>{label}</p>
                    <span>{`${vitamin.quantity.toFixed(1)}${vitamin.unit}`}</span>
                </div>                      
            </div>
}

export default BarColumn