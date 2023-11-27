'use client'

import styles from '../card.module.css'
import { findNutrients } from '@/app/services/fetch-data'
import { Food, Nutrient, Nutrients } from '@/app/types/types'
import { useEffect, useState } from 'react'

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    type Measure = {
        label: string,
        uri: string,
        weight: number
    }

    const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    const [content, setContent] = useState<Nutrients | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOption, setSelectedOption] = useState<string>('Value pre 100g');
    const [measureUri, setMeasureUri] = useState<string>(food.measures[0].uri);
    const [measures, setMeasures] = useState<Measure[]>([]);

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
        let measureNutrients: Nutrients[] = [];
        const fetchMeasuresWeight = async() => {
            for(let i = 0; i < food.measures.length; i++) {
                
                const nutrients: Nutrients = await findNutrients(food.food.foodId, food.measures[i].uri, 1);
                measureNutrients.push(nutrients);
            }
            const measures: Measure[] = measureNutrients.map((measure: any, i) => {
                return {label: food.measures[i].label, uri: food.measures[i].uri, weight: measure.totalWeight};
            })

            setMeasures(measures);
        }
        fetchMeasuresWeight();
    }, [])

    const measuresSelect = () => {
        const options = [<option key={0} value='Value pre 100g' id='initial'>Value pre 100g</option>];
        measures.forEach((measure, index) => {
            options.push(<option key={index + 1} value={measure.label} id={measure.uri}>{`1 ${measure.label} - ${measure.weight} g`}</option>)
        });
        options.push(<option key={measures.length + 1} value='Custom weight' id='custom'>Custom weight</option>)
        return options;
    }

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
        setMeasureUri(id);
    }

    return (
        <div>
            <h1>{food.food.label}</h1>
            {/* <input type="number" value={quantity} placeholder='100' onChange={(e) => hangleQuantityChange(e)}/> */}
            <select name="measure" id="measure" value={selectedOption} onChange={(e) => handleOptionChange(e)}>{measuresSelect()}</select>
            <h2>{`
            // ${quantity} 
            ${selectedOption}`}</h2>
            {content && <div>
                <h2>{`${content.calories} kcal`}</h2>
                <h2>{`${content.totalWeight} g`}</h2>
                <TotalNutrients />
            </div>}
        </div>
    )
}

export default OpenFoodCard