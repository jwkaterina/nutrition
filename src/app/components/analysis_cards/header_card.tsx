import styles from './alanysis_card.module.css';
import { useState, useEffect } from 'react';
import { Food, Measure, Nutrients } from '@/app/types/types';
import { findNutrients } from '@/app/services/fetch-data'

interface HeaderCardProps {
    food: Food,
    option: string,
    setOption: (option: string) => void,
    setMeasure: (measure: string) => void,
    quantity: number,
    setQuantity: (quantity: number) => void
}

const HeaderCard = ({ food, option, setOption, setMeasure, quantity,  setQuantity }: HeaderCardProps): JSX.Element => {

    const [measures, setMeasures] = useState<Measure[]>([]);
    const [customWeight, setCustomWeight] = useState<boolean>(false);
    const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    const ounseUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    const poundUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    const kilogramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";
    const servingUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_serving";

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

    const calculateOptions = (): JSX.Element[] => {
        let options: JSX.Element[] = [];
        if(customWeight) {
            options = [<option key={0} value='grams' id={gramUri}>grams</option>];
        } else {
            options = [<option key={0} value='Value pre 100g' id='initial'>Value pre 100g</option>];
        }
        measures.forEach((measure, index) => {
            if(measure.uri !== gramUri && measure.uri !== ounseUri && measure.uri !== poundUri && measure.uri !== kilogramUri && measure.uri !== servingUri) {
                options.push(<option key={index + 1} value={measure.label} id={measure.uri}>{`1 ${measure.label} - ${measure.weight} g`}</option>)
            }
        });
        if(customWeight) {
            options.push(<option key={0} value='Value pre 100g' id='initial'>Value pre 100g</option>);
        } else {
            options.push(<option key={measures.length + 1} value='Custom weight' id='custom'>Custom weight</option>)
        }

        return options;
    }

    const hangleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(e.target.value));
    }

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const select = e.target;
        const id = select.children[select.selectedIndex].id;
        setMeasure(id);

        if(id === 'custom') {
            setCustomWeight(true);
            setOption('grams');
            setQuantity(100);
        } else {
            setCustomWeight(false);
            setOption(select.value);
            setQuantity(1);
        }
    }

    const { image } = food.food;
    const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
    }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div style={{padding: '2rem'}}>
                <div className={styles.header}>
                    {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                    <h1>{food.food.label}</h1>      
                </div>
                <div className={styles.form}>
                    {customWeight && <input type="number" value={quantity} placeholder='100' onChange={(e) => hangleQuantityChange(e)}/>}
                    <select 
                        name="measure" 
                        id="measure" 
                        className={customWeight ? styles.short_select : ''} 
                        value={option} 
                        onChange={(e) => handleOptionChange(e)}>
                        {calculateOptions()}
                    </select>
                </div>
            </div>
    </div>
    )
}

export default HeaderCard;