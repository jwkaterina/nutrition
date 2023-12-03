'use client'

import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Food, Nutrient, Nutrients } from '@/app/types/types'
import { useEffect, useState } from 'react'
import HeaderCard from '../../analysis_cards/header_card'
import DailyValueCard from '../../analysis_cards/dailyvalue_card'
import CompositionCard from '../../analysis_cards/composition_card'

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
            if(selectedOption === 'grams') {
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

    return (
        <div className={styles.card_grid}>
            <HeaderCard 
                food={food} 
                option={selectedOption} 
                setOption={setSelectedOption} 
                setMeasure={setMeasureUri} 
                quantity={quantity}
                setQuantity={setQuantity}/>
            {content && <DailyValueCard content={content} />}
            {/* <div className={styles.analysis_card}>
                   <h2>{`${quantity} ${selectedOption}`}</h2>
                {content && <div style={{overflow: 'auto'}}>
                    <h2>{`${content.totalWeight} g`}</h2>
                    <TotalNutrients />
                </div>}
            </div> */}
            {contentPercent && <CompositionCard contentPercent={contentPercent} />}
        </div>
    )
}

export default OpenFoodCard