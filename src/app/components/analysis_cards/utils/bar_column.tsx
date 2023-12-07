import styles from '../alanysis_card.module.css'
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
    if(vitaminPercent) percentHeight = vitaminPercent.quantity / 100 * barHeight;

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
                <p>{label}</p>
                <p>{`${vitamin.quantity} ${vitamin.unit}`}</p>
            </div>
}

export default BarColumn