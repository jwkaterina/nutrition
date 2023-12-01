import styles from './alanysis_card.module.css';
import { Nutrients, Food } from '@/app/types/types';
import { useEffect, useState, useRef } from 'react';
import { findNutrients } from '@/app/services/fetch-data';

interface CompositionCardProps {
    food: Food;
}

const CompositionCard = ({ food }: CompositionCardProps): JSX.Element => {

    const [contentPercent, setContentPercent] = useState<Nutrients | null>(null);
    const [waterPercent, setWaterPercent] = useState<number>(0);
    const [proteinPercent, setProteinPercent] = useState<number>(0);
    const [carbsPercent, setCarbsPercent] = useState<number>(0);
    const [fatPercent, setFatPercent] = useState<number>(0);
    const waterRef = useRef<SVGCircleElement>(null);
    const proteinRef = useRef<SVGCircleElement>(null);
    const carbsRef = useRef<SVGCircleElement>(null);
    const fatRef = useRef<SVGCircleElement>(null);

    const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    useEffect(() => {

        const fetchNutreintsPercent = async() => {
            const nutrientsPercent = await findNutrients(food.food.foodId, gramUri, 100);
            setContentPercent(nutrientsPercent);
        }
        fetchNutreintsPercent();
    }, [])

    const radius = 70;
    const circumreference = radius * 2 * Math.PI;

    useEffect(() => {
        if(contentPercent) {
            if(contentPercent.totalNutrients.WATER) setWaterPercent(contentPercent.totalNutrients.WATER.quantity);
            if(contentPercent.totalNutrients.PROCNT) setProteinPercent(contentPercent.totalNutrients.PROCNT.quantity);
            if(contentPercent.totalNutrients.CHOCDF) setCarbsPercent(contentPercent.totalNutrients.CHOCDF.quantity);
            if(waterPercent && carbsPercent && proteinPercent) setFatPercent(100 - (waterPercent + carbsPercent + proteinPercent));
            showComposition(waterPercent, waterRef.current);
            showComposition(proteinPercent, proteinRef.current);
            showComposition(carbsPercent, carbsRef.current);
            showComposition(100 - (waterPercent + carbsPercent + proteinPercent), fatRef.current);
        }  
      
    }, [contentPercent])

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

    const waterDeg = 0;
    const proteinDeg = (waterPercent / 100 * 360);
    const carbsDeg = ((proteinPercent + waterPercent) / 100 * 360);
    const fatDeg = ((carbsPercent + proteinPercent + waterPercent) / 100 * 360);

    const strokeWidth = 20;
    const widthHeight = 2 * radius + 2 * strokeWidth;
    const center = widthHeight / 2;

    if(!contentPercent) return <></>
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
                            {waterPercent && <p>{`${Math.round(waterPercent)} % Water`}</p>}
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.prot_circle}`}></div>
                            {proteinPercent && <p>{`${Math.round(proteinPercent)} % Protein`}</p>}
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.carbs_circle}`}></div>
                            {carbsPercent && <p>{`${Math.round(carbsPercent)} % Carbs`}</p>}
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.fat_circle}`}></div>
                            {fatPercent && <p>{`${Math.round(fatPercent)} % Fat`}</p>}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default CompositionCard;