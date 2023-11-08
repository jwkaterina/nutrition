'use client'

import Card from '../card'
import { useFood } from '@/app/context/food-context'
import Slide from './slide'
import Button from '@/app/components/button'

const Food = () => {

    const food = useFood();

    const foodList = food.map((food, index) => {
        return (
            <Card title={food.label} 
                text={{
                    kcal: food.nutrients.ENERC_KCAL,
                    carb: food.nutrients.CHOCDF,
                    fat: food.nutrients.FAT,
                    prot: food.nutrients.PROCNT,
            
                }} 
                key={food.foodId} 
                index={index + 1} 
                imgUrl={food.image}/>
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