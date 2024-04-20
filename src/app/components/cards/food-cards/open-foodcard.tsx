import { useContext, useEffect, useState } from 'react';
import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import CompositionCard from '../../analysis-cards/composition-card';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import FatsCard from '../../analysis-cards/fats-card';
import FoodHeaderCard from './header-foodcard';
import MineralsCard from '../../analysis-cards/minerals-card';
import VitaminsCard from '../../analysis-cards/vitamins-card';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, Nutrients } from '@/app/types/types';
import styles from '../card.module.css';

interface OpenFoodCardProps {
    food: Food,
    initialNutrients: Nutrients | null
}

const OpenFoodCard  = ({ food, initialNutrients }: OpenFoodCardProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [content, setContent] = useState<Nutrients | null>(initialNutrients);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOption, setSelectedOption] = useState<string>('Value pre 100g');
    const [measureUri, setMeasureUri] = useState<string>(food.measures[0].uri);
    const [blockSelect, setBlockSelect] = useState<boolean>(false);

    const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    useEffect(() => {
        const fetchContent = async() => {
            if(selectedOption === 'grams') {
                try {
                    const nutrients: Nutrients = await sendRequest(
                        `/api/nutrients`,
                        'POST',
                        JSON.stringify({
                            foodId: food.food.foodId, 
                            measure: gramUri, 
                            quantity: quantity
                        }),
                        { 'Content-Type': 'application/json' },
                        false, false
                    );
                    setContent(nutrients);
                    return;
                } catch (err) {
                    setBlockSelect(true);
                }
            } 
            if(selectedOption === 'Value pre 100g') {
                try {
                    const nutrients: Nutrients = await sendRequest(
                        `/api/nutrients`,
                        'POST',
                        JSON.stringify({
                            foodId: food.food.foodId, 
                            measure: gramUri, 
                            quantity: 100
                        }),
                        { 'Content-Type': 'application/json' },
                        false, false
                    );
                    setContent(nutrients);
                    return;
                } catch (err) {
                    setBlockSelect(true);
                }
            }
            try {
                const nutrients: Nutrients = await sendRequest(
                    `/api/nutrients`,
                    'POST',
                    JSON.stringify({
                        foodId: food.food.foodId, 
                        measure: measureUri, 
                        quantity: quantity
                    }),
                    { 'Content-Type': 'application/json' },
                    false, false
                );
                setContent(nutrients);
                return;
            } catch (err) {
                setBlockSelect(true);
            }
        }
        fetchContent();

    }, [quantity, selectedOption]);

    return (
        <div className={styles.card_grid}>
            <FoodHeaderCard 
                food={food} 
                option={selectedOption} 
                setOption={setSelectedOption} 
                setMeasure={setMeasureUri} 
                quantity={quantity}
                setQuantity={setQuantity}
                blockSelect={blockSelect}
            />
            <DailyValueCard content={content} />
            <CompositionCard 
                protein={food.food.nutrients.PROCNT}
                carbs={food.food.nutrients.CHOCDF}
                fat={food.food.nutrients.FAT} 
            />
            <BigNutrientsCard content={content} />
            <VitaminsCard content={content} />
            <MineralsCard content={content} />
            <FatsCard content={content} />
        </div>
    ); 
}

export default OpenFoodCard;