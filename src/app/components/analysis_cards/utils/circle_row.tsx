import { useEffect, useRef } from 'react';
import { Nutrient } from '@/app/types/types';
import styles from './utils.module.css';


interface CircleRowProps {
    nutrient: Nutrient,
    nutrientPercent: Nutrient,
    label: string,
    color: string,
    lightColor: string
}

const CircleRow = ({ nutrient, nutrientPercent, label, color, lightColor }: CircleRowProps): JSX.Element => {

    const arcRef = useRef<SVGCircleElement>(null);

    const radius: number = 15;
    const circumreference: number = radius * 2 * Math.PI;

    useEffect(() => {
        const arc = arcRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = (): number => {
            if(!nutrientPercent || nutrientPercent.quantity == 0) {
                return circumreference
            } else if(nutrientPercent && nutrientPercent.quantity <=100 ) {
                return circumreference - (nutrientPercent.quantity / 100 * circumreference) 
            } else {
                return 0
            }
        }

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: `${progressPercent()}` }
        ];

        if(arc) {
            arcRef.current.animate(keyframes, options);
        }
    }, [nutrientPercent]);

    const styleProgress = () => {

        return {
            strokeDasharray: circumreference,
            strokeDashoffset: circumreference,
        };
    }

    const styleArc = () => {

        return {
            strokeDasharray: circumreference,
        };
    }
    
    const strokeWidth = 5;
    const centerX = radius + strokeWidth;
    const centerY = radius + strokeWidth;
    const widthHeight = radius * 2 + strokeWidth * 2;

    if(!nutrient) return <></>;

    return (
        <div className={styles.circle_row}>
            <p>{label}</p>
            <span>{`${nutrient.quantity.toFixed(1)}${nutrient.unit}`}</span>
            <svg width={widthHeight} height={widthHeight}>
                <circle  style={styleArc()}  cx={centerX} cy={centerY} r={radius} stroke={lightColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
                <circle ref={arcRef} style={styleProgress()}  cx={centerX} cy={centerY} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
            </svg>     
            {nutrientPercent ? <span>{`${nutrientPercent.quantity.toFixed(0)}${nutrientPercent.unit}`}</span> : <span>0%</span>}                
        </div>
    );
}

export default CircleRow;