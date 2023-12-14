import { Nutrient } from '@/app/types/types';
import styles from './utils.module.css'
import { useEffect, useRef } from 'react'

interface HalfCircleProps {
    nutrient: Nutrient;
    daily: Nutrient;
    text: string;
    color: string;
    lighterColor: string,
    radius: number;
    strokeWidth: number;
    centerX: number;
    centerY: number;
}

const HalfCircle
 = ({ nutrient, daily, text, color, lighterColor, radius, strokeWidth, centerX, centerY }: HalfCircleProps): JSX.Element => {

    let unit;
    if(nutrient) unit = nutrient.unit;
    if(text === 'Calories') unit = '';

    const arcRef = useRef<SVGCircleElement>(null);
    // const radius = 44;
    const circumreference = radius * 2 * Math.PI;

    useEffect(() => {
        const arc = arcRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = () => {
            if(!daily || daily.quantity == 0) {
                return circumreference
            } else if(daily.quantity <=100 ) {
                return circumreference - (daily.quantity / 100 * circumreference / 2) 
            } else {
                return circumreference / 2
            }
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

    if(!nutrient) return <></>

    const widthHeight = radius * 2 + strokeWidth * 2;

    return (
        <div className={styles.daily_container}>
            <svg width={widthHeight} height={widthHeight}>
                <circle  style={styleArc()}  cx={centerX} cy={centerY} r={radius} stroke={lighterColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
                <circle ref={arcRef} style={styleProgress()}  cx={centerX} cy={centerY} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
            </svg>
            <div className={styles.percentage}>
                {daily && <span>{`${daily.quantity.toFixed(0)}${daily.unit}`}</span>}
                <p>
                    <span>{`${nutrient.quantity.toFixed(0)}${unit} `}</span>
                    {text}
                </p>
            </div>
        </div>
    )
}

export default HalfCircle
