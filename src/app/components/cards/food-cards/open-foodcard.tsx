'use client'

import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Food, Nutrient, Nutrients } from '@/app/types/types'
import { useEffect, useState } from 'react'

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    const [content, setContent] = useState<Nutrients | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOption, setSelectedOption] = useState(food.measures[0].label);
    const [selectedUri, setSelectedUri] = useState(food.measures[0].uri);


    useEffect(() => {
        const fetchContent = async() => {
            const nutrients = await findNutrients(food.food.foodId, selectedUri, quantity);
            setContent(nutrients);
        }
        fetchContent();
    }, [quantity, selectedOption])

    const TotalNutrients = () => {
        let nutrientsArr: Nutrient[] = [];
        const nutrients: any = content!.totalNutrients;
        for(const key in content!.totalNutrients) {
            nutrientsArr.push(nutrients[key]);
        }
        return nutrientsArr.map((nutrient, index) => {
            return <p key={index}>{`${nutrient.label}: ${nutrient.quantity} ${nutrient.unit}`}</p>
        })
    }

    const hangleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(e.target.value));
    }
    
    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const select = e.target;
        const id = select.children[select.selectedIndex].id;
        setSelectedOption(select.value);
        setSelectedUri(id);
    }

    return (
        <div>
            <h1>{food.food.label}</h1>
            <input type="number" value={quantity} onChange={(e) => hangleQuantityChange(e)}/>
            <select name="measure" id="measure" value={selectedOption} onChange={(e) => handleOptionChange(e)} >
                {food.measures.map((measure, index) => {
                    return <option key={index} value={measure.label} id={measure.uri}>{measure.label}</option>
                })}
            </select>
            <h2>{`${quantity} ${selectedOption}`}</h2>
            {content && <div>
                <h2>{`${content.calories} kcal`}</h2>
                <h2>{`${content.totalWeight} g`}</h2>
                <TotalNutrients />
            </div>}
        </div>
    )
}

export default OpenFoodCard