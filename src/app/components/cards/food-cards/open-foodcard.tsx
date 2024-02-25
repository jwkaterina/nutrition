import { useEffect, useState } from 'react';
import BigNutrientsCard from '../../analysis_cards/bignutrients_card';
import CompositionCard from '../../analysis_cards/composition_card';
import DailyValueCard from '../../analysis_cards/dailyvalue_card';
import FatsCard from '../../analysis_cards/fats_card';
import FoodHeaderCard from './header-foodcard';
import MineralsCard from '../../analysis_cards/minerals_card';
import VitaminsCard from '../../analysis_cards/vitamins_card';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, Nutrients } from '@/app/types/types';
import styles from '../card.module.css';

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    const { sendRequest } = useHttpClient();

    const [content, setContent] = useState<Nutrients | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOption, setSelectedOption] = useState<string>('Value pre 100g');
    const [measureUri, setMeasureUri] = useState<string>(food.measures[0].uri);

    const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    useEffect(() => {
        const fetchContent = async() => {
            if(selectedOption === 'grams') {
                try {
                    const nutrients: Nutrients = await sendRequest(
                        `http://localhost:5001/api/nutrients`,
                        'POST',
                        JSON.stringify({
                            foodId: food.food.foodId, 
                            measure: gramUri, 
                            quantity: quantity
                        }),
                        { 'Content-Type': 'application/json' }
                    );
                    setContent(nutrients);
                    return;
                } catch (err) {}
            } 
            if(selectedOption === 'Value pre 100g') {
                try {
                    const nutrients: Nutrients = await sendRequest(
                        `http://localhost:5001/api/nutrients`,
                        'POST',
                        JSON.stringify({
                            foodId: food.food.foodId, 
                            measure: gramUri, 
                            quantity: 100
                        }),
                        { 'Content-Type': 'application/json' }
                    );
                    setContent(nutrients);
                    return;
                } catch (err) {}
            }
            try {
                const nutrients: Nutrients = await sendRequest(
                    `http://localhost:5001/api/nutrients`,
                    'POST',
                    JSON.stringify({
                        foodId: food.food.foodId, 
                        measure: measureUri, 
                        quantity: quantity
                    }),
                    { 'Content-Type': 'application/json' }
                );
                setContent(nutrients);
                return;
            } catch (err) {}
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
            />
            {content && <DailyValueCard content={content} />}
            <CompositionCard 
                protein={food.food.nutrients.PROCNT}
                carbs={food.food.nutrients.CHOCDF}
                fat={food.food.nutrients.FAT} 
            />
            {content && <BigNutrientsCard content={content} />}
            {content && <VitaminsCard content={content} />}
            {content && <MineralsCard content={content} />}
            {content && <FatsCard content={content} />}
        </div>
    );
}

export default OpenFoodCard;