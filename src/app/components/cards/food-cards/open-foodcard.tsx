import { useContext, useEffect, useState } from 'react';
import BigNutrientsCard from '../../analysis_cards/bignutrients_card';
import CompositionCard from '../../analysis_cards/composition_card';
import DailyValueCard from '../../analysis_cards/dailyvalue_card';
import FatsCard from '../../analysis_cards/fats_card';
import FoodHeaderCard from './header-foodcard';
import MineralsCard from '../../analysis_cards/minerals_card';
import VitaminsCard from '../../analysis_cards/vitamins_card';
import { CardOpenContext } from '@/app/context/card-context';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { CardState, Food, Nutrients, StatusType } from '@/app/types/types';
import styles from '../card.module.css';

interface OpenFoodCardProps {
    food: Food
}

const OpenFoodCard  = ({ food }: OpenFoodCardProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const { setStatus, setMessage } = useContext(StatusContext);
    const { setCardOpen } = useContext(CardOpenContext);
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
                        `/api/nutrients`,
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
                        `/api/nutrients`,
                        'POST',
                        JSON.stringify({
                            foodId: food.food.foodId, 
                            measure: gramUri, 
                            quantity: 100
                        }),
                        { 'Content-Type': 'application/json' },
                        true, false
                    );
                    setContent(nutrients);
                    return;
                } catch (err) {
                    console.log(err);
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
                    { 'Content-Type': 'application/json' }
                );
                setContent(nutrients);
                return;
            } catch (err) {}
        }
        fetchContent();

    }, [quantity, selectedOption]);

    if(!content || content.totalDaily || !content.totalNutrients) {
        setCardOpen(CardState.CLOSED);
        console.error('Too many request');
        setStatus(StatusType.ERROR);
        setMessage('Could not analyse food, wait 1 minut and try again.');
        return <></>;
    }

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