'use client'

import FoodList from '@/app/data-base/food-list'
import PageGrid from '../page-grid'
import Card from '../card'

const Food = () => {

    const foodList = FoodList.map((food, index) => {
        return (
            <Card title={food.label} text={food.nutrients.ENERC_KCAL} type={'preview'} key={food.foodId} index={index + 1}/>
        )
    })

    return (
        <PageGrid>
            {foodList}
        </PageGrid>
    )
}

export default Food