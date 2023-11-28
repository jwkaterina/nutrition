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

    const { image } = food.food;
    const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
    }

    const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    const ounseUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    const poundUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    const kilogramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";

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

    // useEffect(() => {
    //     let measureNutrients: Nutrients[] = [];
    //     const fetchMeasuresWeight = async() => {
    //         for(let i = 0; i < food.measures.length; i++) {
                
    //             const nutrients: Nutrients = await findNutrients(food.food.foodId, food.measures[i].uri, 1);
    //             measureNutrients.push(nutrients);
    //         }
    //         const measures: Measure[] = measureNutrients.map((measure: any, i) => {
    //             return {label: food.measures[i].label, uri: food.measures[i].uri, weight: measure.totalWeight};
    //         })

    //         setMeasures(measures);
    //     }
    //     fetchMeasuresWeight();
    // }, [])

    const measuresSelect = () => {
        const options = [<option key={0} value='Value pre 100g' id='initial'>Value pre 100g</option>];
            measures.forEach((measure, index) => {
                if(measure.uri !== gramUri && measure.uri !== ounseUri && measure.uri !== poundUri && measure.uri !== kilogramUri) {
                    options.push(<option key={index + 1} value={measure.label} id={measure.uri}>{`1 ${measure.label} - ${measure.weight} g`}</option>)
                }
            });
        
        options.push(<option key={measures.length + 1} value='Custom weight' id='custom'>Custom weight</option>)
        return options;
    }

    const TotalNutrients = () => {
        let nutrientsArr: Nutrient[] = [];
        const nutrients: any = content!.totalNutrients;
        // console.log(content);
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

    const water = () => { if(content) return content.totalNutrients.WATER.quantity}
    const protein = () => { if(content) return content.totalNutrients.PROCNT.quantity}
    const carbs = () => { if(content) return content.totalNutrients.CHOCDF.quantity}
    const fat = () => { if(content) return content.totalNutrients.FAT.quantity}


    const compositionStyle = () => {
        if(!content) return;
        const proteinDeg = protein() / 100 * 360;
        const carbsDeg = (protein() + carbs()) / 100 * 360;
        const fatDeg = (protein() + carbs() + fat()) / 100 * 360;
        // console.log(proteinDeg, carbsDeg, fatDeg);
        return {
            background: `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${proteinDeg}deg, var(--secondary-color) ${proteinDeg}deg, var(--secondary-color) ${carbsDeg}deg, var(--tertiary-color) ${carbsDeg}deg, var(--tertiary-color) ${fatDeg}deg, gray ${fatDeg}deg, gray 360deg)`
        }
    }

    return (
        <div className={styles.card_grid}>
            <div className={styles.analysis_card}>
                <div className={styles.header}>
                    {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                    <h1>{food.food.label}</h1>      
                </div>
                {/* <input type="number" value={quantity} placeholder='100' onChange={(e) => hangleQuantityChange(e)}/> */}
                <select 
                    name="measure" 
                    id="measure" 
                    className={styles.select} 
                    value={selectedOption} 
                    onChange={(e) => handleOptionChange(e)}>
                    {measuresSelect()}
                </select>
            </div>
            <div className={styles.analysis_card}>
                <h3 className={styles.title}>Daily Value</h3>
                <div className={styles.total_calories}>
                    <div className={styles.calories_progress}>
                        <div className={styles.calories_inner_circle}>
                            {content && <div className={styles.percentage}>
                                <p>{`${content.totalDaily.ENERC_KCAL.quantity} ${content.totalDaily.ENERC_KCAL.unit}`}</p>
                                <h3>{`${content.calories} Calories`}</h3>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.analysis_card}>
                   {/* <h2>{`${quantity} ${selectedOption}`}</h2> */}
                {content && <div>
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
                            <p>{`Water ${Math.round(water())} %`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.prot_circle}`}></div>
                            <p>{`Protein ${Math.round(protein())} %`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.carbs_circle}`}></div>
                            <p>{`Carbs ${Math.round(carbs())} %`}</p>
                        </div>
                        <div className={styles.composition_cell}>
                            <div className={`${styles.circle} ${styles.fat_circle}`}></div>
                            <p>{`Fat ${Math.round(fat())} %`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenFoodCard