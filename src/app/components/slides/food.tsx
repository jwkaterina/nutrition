'use client'

import Card from '../card'
import { useFood } from '@/app/context/food-context'
import Slide from './slide'
import Button from '@/app/components/button'

const Food = () => {

    const food = useFood();

    const foodList = food.map((food, index) => {
        return (
            <Card title={food.label} text={food.nutrients.ENERC_KCAL} key={food.foodId} index={index + 1} imgUrl=''/>
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