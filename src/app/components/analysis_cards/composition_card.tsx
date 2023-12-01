import styles from './alanysis_card.module.css';
import { Nutrients, Food } from '@/app/types/types';
import { useEffect, useState, useRef } from 'react';
import { findNutrients } from '@/app/services/fetch-data';

interface CompositionCardProps {
    food: Food;
}

const CompositionCard = ({ food }: CompositionCardProps): JSX.Element => {

    const [contentPercent, setContentPercent] = useState<Nutrients | null>(null);
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

    let waterPercent: number, proteinPercent: number, carbsPercent: number, fatPercent: number;
    if(contentPercent) {
        if(contentPercent.totalNutrients.WATER) waterPercent = contentPercent.totalNutrients.WATER.quantity;;
        if(contentPercent.totalNutrients.PROCNT) proteinPercent = contentPercent.totalNutrients.PROCNT.quantity;
        if(contentPercent.totalNutrients.CHOCDF) carbsPercent = contentPercent.totalNutrients.CHOCDF.quantity;
        if(contentPercent.totalNutrients.FAT) fatPercent = contentPercent.totalNutrients.FAT.quantity;
    }

    const radius = 96;
    const circumreference = radius * 2 * Math.PI;

    useEffect(() => {
        showComposition();
    }, [contentPercent])

    const showComposition = () => {
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        showWater(options);
        showProtein(options);
        // showCarbs(options);
        // showFat(options);
    }

    const showWater = (options: KeyframeAnimationOptions) => {

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: circumreference - (waterPercent / 100 * circumreference)}
        ];

        if(waterRef.current) {
            waterRef.current.animate(keyframes, options);
        }
    }

    const showProtein = (options: KeyframeAnimationOptions) => {

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference - (waterPercent / 100 * circumreference)},
            { strokeDashoffset: circumreference - (proteinPercent / 100 * circumreference)}
        ];

        if(proteinRef.current) {
            proteinRef.current.animate(keyframes, options);
        }
    }

    const styleWater = () => {
        if(waterPercent) {
            return {
                strokeDasharray: circumreference
            }
        }
    }

    const styleProtein = () => {
        if(proteinPercent) {
            return {
                strokeDasharray: circumreference
            };
        }
    }  

    return (
        <div className={styles.container}>
                <div className={styles.composition_grid}>
                    <svg width="200" height="200">
                        <circle  style={styleWater()} ref={waterRef} cx="100" cy="100" r={radius} stroke="#ccc" stroke-width="6" fill="none"/>
                        <circle style={styleProtein()} ref={proteinRef} cx="100" cy="100" r={radius} stroke='var(--primary-color)' stroke-width="6" fill="none"/>
                        {/* <circle  style={{strokeDasharray: circumreference}} ref={carbsRef} cx="100" cy="100" r={radius} stroke="var(--secondary-color)" stroke-width="6" fill="none"/> */}
                        {/* <circle style={{strokeDasharray: circumreference}} ref={fatRef} cx="100" cy="100" r={radius} stroke='var(--tertiary-color)' stroke-width="6" fill="none"/> */}
                    </svg>
                    <div className={styles.composition_column}>
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