import { Food, CardState } from '@/app/types/types'
import Card from '../card'
import { useContext, useState } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { CurrentFoodContext } from '@/app/context/food-context'
import OpenFoodCard from './open-foodcard'
import ClosedFoodCard from './closed-foodcard'

interface FoodCardProps {
    food: Food,
    index: number,
    id: string | null
}

const FoodCard = ({ food, index, id }: FoodCardProps): JSX.Element => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setCurrentFood } = useContext(CurrentFoodContext);

    const handleCardClick = () => {
        if(isOpen) {
            return 
        }
        setCardOpen(CardState.OPEN);
        setIsOpen(true); 

        setCurrentFood({
            food: food,
            id: id ? id : null
        });
    }

    return <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen ? <OpenFoodCard food={food}/> : <ClosedFoodCard food={food}/>}
        </Card>
}

export default FoodCard