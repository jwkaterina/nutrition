'use client'

import FoodList from '@/app/data-base/food-list'
import PageGrid from '../page-grid'
import Card from '../card'
import { FoodProp } from '@/app/types/types'

const Food = () => {

    let initialFood: FoodProp[];
    if(localStorage.getItem('food')) {
      initialFood = JSON.parse(localStorage.getItem('food')!)
    } else {
        initialFood = FoodList;
        localStorage.setItem('food', JSON.stringify(initialFood))
    }

    const foodList = initialFood.map((food, index) => {
        return (
            <Card title={food.label} text={food.nutrients.ENERC_KCAL} key={food.foodId} index={index + 1}/>
        )
    })

    return (
        <PageGrid>
            {foodList}
        </PageGrid>
    )
}

export default Food