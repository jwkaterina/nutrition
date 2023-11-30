'use client'

import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Food, Nutrient, Nutrients } from '@/app/types/types'
import { useEffect, useState } from 'react'
import HeaderCard from '../../analysis_cards/header_card'

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    const [content, setContent] = useState<Nutrients | null>(null);
    const [contentPercent, setContentPercent] = useState<Nutrients | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOption, setSelectedOption] = useState<string>('Value pre 100g');
    const [measureUri, setMeasureUri] = useState<string>(food.measures[0].uri);

    useEffect(() => {
        const fetchContent = async() => {
            if(selectedOption === 'Custom weight') {
                const nutrients = await findNutrients(food.food.foodId, gramUri, quantity);
                setContent(nutrients);
                return;
            } 
            if(selectedOption === 'Value pre 100g') {
                const nutrients = await findNutrients(food.food.foodId, gramUri, 100);
                setContent(nutrients);
                return;
            }
            const nutrients = await findNutrients(food.food.foodId, measureUri, quantity);
            setContent(nutrients);
        }
        fetchContent();

    }, [quantity, selectedOption]);

    useEffect(() => {

        const fetchNutreintsPercent = async() => {
            const nutrientsPercent = await findNutrients(food.food.foodId, gramUri, 100);
            setContentPercent(nutrientsPercent);
        }
        fetchNutreintsPercent();
    }, [])

    const TotalNutrients = () => {
        let nutrientsArr: Nutrient[] = [];
        const nutrients: any = content!.totalNutrients;
        for(const key in content!.totalNutrients) {
            nutrientsArr.push(nutrients[key]);
            
        }
        return nutrientsArr.map((nutrient, index) => {
            return <p key={index}>{`${nutrient.label}: ${nutrient.quantity} ${nutrient.unit} `}</p>
        })
    }

    let water: number, protein: number, carbs: number, fat: number;
    if(content) {
        if(content.totalNutrients.WATER) water = content.totalNutrients.WATER.quantity;
        if(content.totalNutrients.PROCNT) protein = content.totalNutrients.PROCNT.quantity;
        if(content.totalNutrients.CHOCDF) carbs = content.totalNutrients.CHOCDF.quantity;
        if(content.totalNutrients.FAT) fat = content.totalNutrients.FAT.quantity;
    }

    let waterPercent: number, proteinPercent: number, carbsPercent: number, fatPercent: number;
    if(contentPercent) {
        if(contentPercent.totalNutrients.WATER) waterPercent = contentPercent.totalNutrients.WATER.quantity;;
        if(contentPercent.totalNutrients.PROCNT) proteinPercent = contentPercent.totalNutrients.PROCNT.quantity;
        if(contentPercent.totalNutrients.CHOCDF) carbsPercent = contentPercent.totalNutrients.CHOCDF.quantity;
        if(contentPercent.totalNutrients.FAT) fatPercent = contentPercent.totalNutrients.FAT.quantity;
    }

    const compositionStyle = () => {
        if(!contentPercent) return;

        const proteinDeg = proteinPercent / 100 * 360;
        const carbsDeg = (proteinPercent + carbsPercent) / 100 * 360;
        const fatDeg = (proteinPercent + carbsPercent + fatPercent) / 100 * 360;
        // console.log(proteinDeg, carbsDeg, fatDeg);
        return {
            background: `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${proteinDeg}deg, var(--secondary-color) ${proteinDeg}deg, var(--secondary-color) ${carbsDeg}deg, var(--tertiary-color) ${carbsDeg}deg, var(--tertiary-color) ${fatDeg}deg, gray ${fatDeg}deg, gray 360deg)`
        }
    }

    return (
        <div className={styles.card_grid}>
            <HeaderCard food={food} option={selectedOption} setOption={setSelectedOption} setMeasure={setMeasureUri} setQuantity={setQuantity}/>
            <div className={styles.analysis_card}>
                <h3 className={styles.title}>Daily Value</h3>
                <div className={styles.daily_grid}>
                    <div className={styles.total}>
                        <div className={styles.progress}>
                            <div className={styles.inner_circle}>
                                {content && <div className={styles.percentage}>
                                    <p>{`${content.totalDaily.ENERC_KCAL.quantity} ${content.totalDaily.ENERC_KCAL.unit}`}</p>
                                    <h3>{`${content.calories} Calories`}</h3>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.total}>
                        <div className={styles.progress}>
                            <div className={styles.inner_circle}>
                                {content && <div className={styles.percentage}>
                                    <p>{`${content.totalDaily.PROCNT.quantity} ${content.totalDaily.PROCNT.unit}`}</p>
                                    <h3>{`${content.totalNutrients.PROCNT.quantity} ${content.totalNutrients.PROCNT.unit} Protein`}</h3>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.total}>
                        <div className={styles.progress}>
                            <div className={styles.inner_circle}>
                                {content && <div className={styles.percentage}>
                                    <p>{`${content.totalDaily.CHOCDF.quantity} ${content.totalDaily.CHOCDF.unit}`}</p>
                                    <h3>{`${content.totalNutrients.CHOCDF.quantity} ${content.totalNutrients.CHOCDF.unit} Carbs`}</h3>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.total}>
                        <div className={styles.progress}>
                            <div className={styles.inner_circle}>
                                {content && <div className={styles.percentage}>
                                    <p>{`${content.totalDaily.FAT.quantity} ${content.totalDaily.FAT.unit}`}</p>
                                    <h3>{`${content.totalNutrients.FAT.quantity} ${content.totalNutrients.FAT.unit} Fat`}</h3>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.analysis_card}>
                   {/* <h2>{`${quantity} ${selectedOption}`}</h2> */}
                {content && <div style={{overflow: 'auto'}}>
                    {/* <h2>{`${content.totalWeight} g`}</h2> */}
                    <TotalNutrients />
                </div>}
            </div>
            <div className={styles.analysis_card}>
                <div className={styles.composition_grid}>
                    <div className={styles.outer_circle} style={compositionStyle()}>
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
            <div className={styles.analysis_card}>
                <div className={styles.daylies_grid}>
                    <div className={styles.daylies_column}>
                        <h3>Protein</h3>
                        {protein && <p>{`${protein} g`}</p>}
                    </div>
                    <div className={styles.daylies_column}>
                        <h3>Carbs</h3>
                        {carbs && <p>{`${carbs} g`}</p>}
                    </div>
                    <div className={styles.daylies_column}>
                        <h3>Fat</h3>
                        {fat && <p>{`${fat}`}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenFoodCard