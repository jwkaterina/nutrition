'use client'

import { Food } from '@/app/types/types'
import Card from '../card'
import { useContext } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import OpenCard from './open-foodcard'
import ClosedCard from './closed-foodcard'

interface FoodCardProps {
    food: Food,
    index: number
}

const FoodCard = ({ food, index }: FoodCardProps): JSX.Element => {

    const cardOpen = useContext(CardOpenContext);

    return (
        <Card index={index} >
            {cardOpen ? <OpenCard food={food}/> : <ClosedCard food={food}/> }
        </Card>
    )
}

export default FoodCard