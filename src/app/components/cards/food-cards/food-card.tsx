import { useContext, useState } from 'react';
import Card from '../card';
import ClosedCard from '../closed-card';
import OpenFoodCard from './open-foodcard';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentFoodContext } from '@/app/context/food-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { Food, CardState, Nutrients } from '@/app/types/types';

interface FoodCardProps {
    food: Food,
    index: number,
    id: string | null,
    open: boolean
}

const FoodCard = ({ food, index, id, open }: FoodCardProps): JSX.Element => {

    const { setCardOpen } = useContext(CardOpenContext);
    const { setCurrentFood } = useContext(CurrentFoodContext);
    const { sendRequest } = useHttpClient();
    const [isOpen, setIsOpen] = useState<boolean>(open);
    const [nutrients, setNutrients] = useState<Nutrients | null>(null);

    const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

    const handleCardClick = async() => {
        if(isOpen) {
            return;
        }
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
            setNutrients(nutrients);
            setCardOpen(CardState.OPENING);
            setIsOpen(true); 
    
            setCurrentFood({
                food: food,
                id: id ? id : null
            });
        } catch (err) {}
    }

    const isImage = () => {
        return /\.(jpg|jpeg)$/.test(food.food.image);
    }

    return (
        <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen ? <OpenFoodCard food={food} initialNutrients={nutrients}/> : 
            <ClosedCard 
                title={food.food.label}
                image={isImage() ? food.food.image : ''}
                calories={food.food.nutrients.ENERC_KCAL}
                protein={food.food.nutrients.PROCNT}
                fat={food.food.nutrients.FAT}
                carbs={food.food.nutrients.CHOCDF}
            />}
        </Card>
    );
}

export default FoodCard;