import { Nutrient } from '@/app/types/types';
import styles from '../alanysis_card.module.css'
import { useEffect, useRef } from 'react'

interface HalfCircleProps {
    nutrient: Nutrient;
    daily: Nutrient;
    text: string;
    color: string;
    lighterColor: string
}

const HalfCircle
 = ({ nutrient, daily, text, color, lighterColor }: HalfCircleProps): JSX.Element => {

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
            if(!daily || daily.quantity == 0) return progressPercent = circumreference;
            if(daily.quantity <=100 ) progressPercent = circumreference - (daily.quantity / 100 * circumreference / 2) 
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
                <circle  style={styleArc()}  cx="50" cy="50" r={radius} stroke={lighterColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
                <circle className={styles.arc_animation} ref={arcRef} style={styleProgress()}  cx="50" cy="50" r={radius} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <div className={styles.percentage}>
                {daily && <p>{`${daily.quantity.toFixed(0)} ${daily.unit}`}</p>}
                {nutrient && <h5>{`${nutrient.quantity.toFixed(0)} ${nutrient.unit} `}<span style={{color: color}}>{text}</span></h5>}
            </div>
        </div>
    )
}

export default HalfCircle
