'use client'

import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Food, Nutrient, Nutrients } from '@/app/types/types'
import { useEffect, useState } from 'react'

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    const quantity = 1;

    const [content, setContent] = useState<Nutrients | null>(null);

    useEffect(() => {
    const fetchContent = async() => {
        const nutrients = await findNutrients(food.food.foodId, food.measures[0].uri, quantity);
        console.log(nutrients);
        setContent(nutrients);
    }
    fetchContent();
    }, [])

    const TotalNutrients = () => {
        let nutrientsArr: Nutrient[] = [];
        for(const key in content!.totalNutrients) {
            nutrientsArr.push(content.totalNutrients[key]);
        }
        return nutrientsArr.map((nutrient, index) => {
            return <h2 key={index}>{`${nutrient.label}: ${nutrient.quantity} ${nutrient.unit}`}</h2>
        })
    }
    

    return (
        <div>
            <h1>{food.food.label}</h1>
            <h2>{`${quantity} ${food.measures[0].label}`}</h2>
            {content && <div>
                <h2>{`${content.calories} kcal`}</h2>
                <h2>{`${content.totalWeight} g`}</h2>
                <TotalNutrients />
            </div>}
        </div>
    )
}

export default OpenFoodCard