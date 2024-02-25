import { useContext, useState } from 'react';
import Card from '../card';
import ClosedCard from '../closed-card';
import OpenFoodCard from './open-foodcard';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentFoodContext } from '@/app/context/food-context';
import { Food, CardState } from '@/app/types/types';

interface FoodCardProps {
    food: Food,
    index: number,
    id: string | null,
    open: boolean
}

const FoodCard = ({ food, index, id, open }: FoodCardProps): JSX.Element => {

    const { setCardOpen } = useContext(CardOpenContext);
    const { setCurrentFood } = useContext(CurrentFoodContext);
    const [isOpen, setIsOpen] = useState<boolean>(open);

    const handleCardClick = () => {
        if(isOpen) {
            return;
        }
        setCardOpen(CardState.OPENING);
        setIsOpen(true); 

        setCurrentFood({
            food: food,
            id: id ? id : null
        });
    }

    const isImage = () => {
        return /\.(jpg|jpeg)$/.test(food.food.image);
    }

    return (
        <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen ? <OpenFoodCard food={food}/> : 
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