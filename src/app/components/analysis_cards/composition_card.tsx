import styles from './alanysis_card.module.css';
import { Nutrients, Food } from '@/app/types/types';
import { useEffect, useState, useRef } from 'react';
import { findNutrients } from '@/app/services/fetch-data';

interface CompositionCardProps {
    contentPercent: Nutrients | null;
}

const CompositionCard = ({ contentPercent }: CompositionCardProps): JSX.Element => {

    const [waterPercent, setWaterPercent] = useState<number | null>(null);
    const [proteinPercent, setProteinPercent] = useState<number | null>(null);
    const [carbsPercent, setCarbsPercent] = useState<number | null>(null);
    const [fatPercent, setFatPercent] = useState<number | null>(null);

    const [waterDeg, setWaterDeg] = useState<number>(0);
    const [proteinDeg, setProteinDeg] = useState<number>(0);
    const [carbsDeg, setCarbsDeg] = useState<number>(0);
    const [fatDeg, setFatDeg] = useState<number>(0);

    const waterRef = useRef<SVGCircleElement>(null);
    const proteinRef = useRef<SVGCircleElement>(null);
    const carbsRef = useRef<SVGCircleElement>(null);
    const fatRef = useRef<SVGCircleElement>(null);

    const radius = 70;
    const circumreference = radius * 2 * Math.PI;

    useEffect(() => {
        const composition = contentPercent!.totalNutrients;
            if(composition.WATER) setWaterPercent(composition.WATER.quantity);
            if(composition.PROCNT) setProteinPercent(composition.PROCNT.quantity);
            if(composition.CHOCDF) setCarbsPercent(composition.CHOCDF.quantity);
            if(waterPercent && carbsPercent && proteinPercent) setFatPercent(100 - (waterPercent + carbsPercent + proteinPercent));

            if(waterPercent && proteinPercent && carbsPercent && fatPercent)  {
                showComposition(waterPercent, waterRef.current);
                showComposition(proteinPercent, proteinRef.current);
                showComposition(carbsPercent, carbsRef.current);
                showComposition(fatPercent, fatRef.current);

                setWaterDeg(0);
                setProteinDeg(waterPercent / 100 * 360);
                setCarbsDeg((proteinPercent + waterPercent) / 100 * 360);
                setFatDeg((carbsPercent + proteinPercent + waterPercent) / 100 * 360);
            }
    })

    // useEffect(() => {
    //     if(waterPercent) showComposition(waterPercent, waterRef.current);
    //     if(proteinPercent) showComposition(proteinPercent, proteinRef.current);
    //     if(carbsPercent) showComposition(carbsPercent, carbsRef.current);
    //     if(fatPercent) showComposition(fatPercent, fatRef.current);
    // })


    const showComposition = (percent: number, ref: SVGCircleElement | null) => {

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: circumreference - (percent / 100 * circumreference) }
        ];

        if(ref) {
            ref.animate(keyframes, options);
        }
    }

    const strokeWidth = 20;
    const widthHeight = 2 * radius + 2 * strokeWidth;
    const center = widthHeight / 2;

    if(!waterPercent || !proteinPercent || !carbsPercent || !fatPercent) return <></>
    return (
        <div className={styles.container}>
                <div className={styles.composition_grid}>
                    {contentPercent && <div className={styles.composition_donut} style={{width: widthHeight}}>
                        <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${waterDeg}deg)`}}>
                            <circle  style={{strokeDasharray: circumreference}} ref={waterRef} cx={center} cy={center} r={radius} stroke="#ccc" strokeWidth={strokeWidth} fill="none"/>
                        </svg>
                        <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${proteinDeg}deg)`}}>
                            <circle style={{strokeDasharray: circumreference}} ref={proteinRef} cx={center} cy={center} r={radius} stroke='var(--primary-color)' strokeWidth={strokeWidth} fill="none"/>
                        </svg>
                        <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${carbsDeg}deg)`}}>
                            <circle style={{strokeDasharray: circumreference}} ref={carbsRef} cx={center} cy={center} r={radius} stroke='var(--secondary-color)' strokeWidth={strokeWidth} fill="none"/>
                        </svg>
                        <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${fatDeg}deg)`}}>
                            <circle style={{strokeDasharray: circumreference}} ref={fatRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-color)' strokeWidth={strokeWidth} fill="none"/>
                        </svg>
                    </div>}
                    <div className={styles.composition_column} style={{height: widthHeight}}>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.water_circle}`}></div>
                            <p>{`${Math.round(waterPercent)} % Water`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.prot_circle}`}></div>
                            <p>{`${Math.round(proteinPercent)} % Protein`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.carbs_circle}`}></div>
                            <p>{`${Math.round(carbsPercent)} % Carbs`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.fat_circle}`}></div>
                            <p>{`${Math.round(fatPercent)} % Fat`}</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default CompositionCard;