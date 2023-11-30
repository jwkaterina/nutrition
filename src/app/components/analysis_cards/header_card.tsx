import styles from './alanysis_card.module.css';
import { useState, useEffect } from 'react';
import { Food, Measure, Nutrients } from '@/app/types/types';
import { findNutrients } from '@/app/services/fetch-data'

interface HeaderCardProps {
    food: Food,
    option: string,
    setOption: (option: string) => void,
    setMeasure: (measure: string) => void,
    setQuantity: (quantity: number) => void
}

const HeaderCard = ({ food, option, setOption, setMeasure,  setQuantity }: HeaderCardProps): JSX.Element => {

    const [measures, setMeasures] = useState<Measure[]>([]);
    const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    const ounseUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    const poundUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    const kilogramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";

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
                if(measure.uri !== gramUri && measure.uri !== ounseUri && measure.uri !== poundUri && measure.uri !== kilogramUri) {
                    options.push(<option key={index + 1} value={measure.label} id={measure.uri}>{`1 ${measure.label} - ${measure.weight} g`}</option>)
                }
            });
        
        options.push(<option key={measures.length + 1} value='Custom weight' id='custom'>Custom weight</option>)
        return options;
    }

      // const hangleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuantity(parseInt(e.target.value));
    // }

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const select = e.target;
        const id = select.children[select.selectedIndex].id;
        setOption(select.value);
        setMeasure(id);
    }

    const { image } = food.food;
    const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
    }

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                <h1>{food.food.label}</h1>      
            </div>
            {/* <input type="number" value={quantity} placeholder='100' onChange={(e) => hangleQuantityChange(e)}/> */}
            <select 
                name="measure" 
                id="measure" 
                className={styles.select} 
                value={option} 
                onChange={(e) => handleOptionChange(e)}>
                {measuresSelect()}
            </select>
    </div>
    )
}

export default HeaderCard;