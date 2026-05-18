import { useState } from 'react';
import { Food } from '@/app/types/types';
import styles from '../../analysis-cards/alanysis-card.module.css';

interface FoodHeaderCardProps {
    food: Food,
    option: string,
    setOption: (option: string) => void,
    setMeasure: (measure: string) => void,
    quantity: number,
    setQuantity: (quantity: number) => void,
    blockSelect: boolean
}

const FoodHeaderCard = ({ food, option, setOption, setMeasure, quantity, setQuantity, blockSelect }: FoodHeaderCardProps): JSX.Element => {

    const [customWeight, setCustomWeight] = useState<boolean>(false);

    const { image } = food.food;
    const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    const ounceUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    const poundUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    const kilogramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";
    const servingUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_serving";

    const calculateOptions = (): JSX.Element[] => {
        let options: JSX.Element[] = [];
        if(customWeight) {
            options = [<option key={0} value='grams' id={gramUri}>grams</option>];
        } else {
            options = [<option key={0} value='Value pre 100g' id='initial'>Value pre 100g</option>];
        }
        food.measures.forEach((measure, index) => {
            if(measure.uri !== gramUri && measure.uri !== ounceUri && measure.uri !== poundUri && measure.uri !== kilogramUri && measure.uri !== servingUri) {
                options.push(<option key={index + 1} value={measure.label} id={measure.uri}>{`1 ${measure.label} - ${measure.weight} g`}</option>)
            }
        });
        if(customWeight) {
            options.push(<option key={food.measures.length + 1} value='Value pre 100g' id='initial'>Value pre 100g</option>);
        } else {
            options.push(<option key={food.measures.length + 1} value='Custom weight' id='custom'>Custom weight</option>)
        }

        return options;
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
    }

    const style = () => {
        if(isImage(image)) {
            return { gridTemplateColumns: '1fr 3fr' };
        } else {
            return { gridTemplateColumns: '1fr' };
        }
    }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={style()}>
                {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                <h1>{food.food.label}</h1>      
            </div>
            <div className={styles.form}>
                {customWeight && <input 
                    disabled={blockSelect ? true : false}
                    className={styles.short_input} 
                    type="number" 
                    value={quantity} 
                    placeholder='100' 
                    onChange={(e) => handleQuantityChange(e)}
                />}
                <select 
                    disabled={blockSelect ? true : false}
                    name="measure" 
                    id="measure" 
                    className={customWeight ? styles.short_select : ''} 
                    value={option} 
                    onChange={(e) => handleOptionChange(e)}>
                    {calculateOptions()}
                </select>
            </div>
        </div>
    );
}

export default FoodHeaderCard;