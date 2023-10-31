'use client'

import PageGrid from '../page-grid'
import Card from '../card'
import { useFood } from '@/app/context/food-context'

const Food = () => {

    const food = useFood();

    const foodList = food.map((food, index) => {
        return (
            <Card title={food.label} text={food.nutrients.ENERC_KCAL} key={food.foodId} index={index + 1}/>
        )
    })

    return (
        <PageGrid search={'analysis/food-analysis'}>
            {foodList}
        </PageGrid>
    )
}

export default Food