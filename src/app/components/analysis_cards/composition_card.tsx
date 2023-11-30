import styles from './alanysis_card.module.css';
import { Nutrients, Food } from '@/app/types/types';
import { useEffect, useState } from 'react';
import { findNutrients } from '@/app/services/fetch-data';

interface CompositionCardProps {
    food: Food;
}

const CompositionCard = ({ food }: CompositionCardProps): JSX.Element => {

    const [contentPercent, setContentPercent] = useState<Nutrients | null>(null);
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

    const composition = () => {
        if(!contentPercent) return;

        const proteinDeg = proteinPercent / 100 * 360;
        const carbsDeg = (proteinPercent + carbsPercent) / 100 * 360;
        const fatDeg = (proteinPercent + carbsPercent + fatPercent) / 100 * 360;

        return {background: `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${proteinDeg}deg, white ${proteinDeg}deg, white ${proteinDeg}deg, var(--secondary-color) ${proteinDeg}deg, var(--secondary-color) ${carbsDeg}deg, white ${carbsDeg}deg, white ${carbsDeg}deg, var(--tertiary-color) ${carbsDeg}deg, var(--tertiary-color) ${fatDeg}deg, white ${fatDeg}deg, white ${fatDeg}deg, gray ${fatDeg}deg, gray 360deg)`}

    }

    return (
        <div className={styles.container}>
                <div className={styles.composition_grid}>
                    <div className={styles.outer_circle} style={composition()}>
                        <div className={styles.composition_inner_circle}></div>
                    </div>
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