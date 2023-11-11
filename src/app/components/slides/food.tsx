'use client'

import { useFood } from '@/app/context/food-context'
import Slide from './slide'
import Button from '@/app/components/button'
import { Food } from '@/app/types/types'
import FoodCard from '../cards/food-cards/food-card'

const Food = () => {

    const food: Food[] = useFood();

    const foodList = food.map((food, index) => {
        return (
            <FoodCard food={food} index={index + 1} key={`${food.food.foodId}-${food.food.label}`}/>
        )
    })

    return (
        <Slide>
            {foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>    
    )
}

export default Food