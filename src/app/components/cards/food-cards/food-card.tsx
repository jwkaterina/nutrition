'use client'

import { Food } from '@/app/types/types'
import Card from '../card'
import { useContext } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import OpenFoodCard from './open-foodcard'
import ClosedCard from './closed-foodcard'

interface FoodCardProps {
    food: Food,
    index: number,
    id: string
}

const FoodCard = ({ food, index, id }: FoodCardProps): JSX.Element => {

    const cardOpen = useContext(CardOpenContext);

        if(cardOpen == index) return <Card index={index} id={id}> 
                <OpenFoodCard food={food}/>
            </Card>
        else return <Card index={index} id={id}> 
                <ClosedCard food={food}/>
            </Card> 
}

export default FoodCard