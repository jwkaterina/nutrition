'use client'

import Card from '../card'
import { useFood } from '@/app/context/food-context'
import Slide from './slide'
import Button from '@/app/components/button'

const Food = () => {

    const food = useFood();

    const foodList = food.map((food, index) => {
        return (
            <Card title={food.food.label} 
                text={{
                    kcal: food.food.nutrients.ENERC_KCAL,
                    carb: food.food.nutrients.CHOCDF,
                    fat: food.food.nutrients.FAT,
                    prot: food.food.nutrients.PROCNT,
            
                }} 
                key={food.food.foodId} 
                index={index + 1} 
                imgUrl={food.food.image}
                measures={food.measures}
            />
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