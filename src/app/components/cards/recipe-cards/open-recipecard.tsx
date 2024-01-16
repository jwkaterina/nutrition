import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Recipe } from '@/app/types/types'
import { useEffect, useState } from 'react'
import HeaderCard from '../../analysis_cards/header_card'
import DailyValueCard from '../../analysis_cards/dailyvalue_card'
import CompositionCard from '../../analysis_cards/composition_card'
import BigNutrientsCard from '../../analysis_cards/bignutrients_card'
import VitaminsCard from '../../analysis_cards/vitamins_card'
import MineralsCard from '../../analysis_cards/minerals_card'
import FatsCard from '../../analysis_cards/fats_card'

interface OpenRecipeCardProps {
    recipe: Recipe
}

const OpenRecipeCard  = ({ recipe }: OpenRecipeCardProps): JSX.Element => {

    const weight: number = recipe.nutrients.totalWeight;
    const devideBy: number = weight / 100;

    const proteinPer100gram: number = recipe.nutrients.totalNutrients.PROCNT.quantity / devideBy;
    const carbsPer100gram: number = recipe.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
    const fatPer100gram: number = recipe.nutrients.totalNutrients.FAT.quantity / devideBy;

    // const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    // const [content, setContent] = useState<Nutrients | null>(null);
    // const [contentPercent, setContentPercent] = useState<Nutrients | null>(null);
    // const [quantity, setQuantity] = useState<number>(1);
    // const [selectedOption, setSelectedOption] = useState<string>('Value pre 100g');
    // const [measureUri, setMeasureUri] = useState<string>(food.measures[0].uri);

    // useEffect(() => {
    //     const fetchContent = async() => {
    //         if(selectedOption === 'grams') {
    //             const nutrients = await findNutrients(food.food.foodId, gramUri, quantity);
    //             setContent(nutrients);
    //             return;
    //         } 
    //         if(selectedOption === 'Value pre 100g') {
    //             const nutrients = await findNutrients(food.food.foodId, gramUri, 100);
    //             setContent(nutrients);
    //             return;
    //         }
    //         const nutrients = await findNutrients(food.food.foodId, measureUri, quantity);
    //         setContent(nutrients);
    //     }
    //     fetchContent();

    // }, [quantity, selectedOption]);


    // useEffect(() => {

    //     const fetchNutreintsPercent = async() => {
    //         const nutrientsPercent = await findNutrients(food.food.foodId, gramUri, 100);
    //         setContentPercent(nutrientsPercent);
    //     }
    //     fetchNutreintsPercent();
    // }, [])

    return (
        <div className={styles.card_grid}>
            {/* <HeaderCard 
                food={food} 
                option={selectedOption} 
                setOption={setSelectedOption} 
                setMeasure={setMeasureUri} 
                quantity={quantity}
                setQuantity={setQuantity}/> */}
            {recipe && <DailyValueCard content={recipe.nutrients} />}
            <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            />
            {recipe && <BigNutrientsCard content={recipe.nutrients} />}
            {recipe && <VitaminsCard content={recipe.nutrients} />}
            {recipe && <MineralsCard content={recipe.nutrients} />}
            {recipe && <FatsCard content={recipe.nutrients} />}
        </div>
    )
}

export default OpenRecipeCard