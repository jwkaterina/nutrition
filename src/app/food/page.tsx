'use client'

import styles from './page.module.css'
import FoodList from '@/app/data-base/food-list'
import PageGrid from '../components/page-grid'
import Card from '../components/card'

const Food = () => {

    const foodList = FoodList.map(food => {
        return (
            <Card title={food.label} id={food.foodId} text={food.nutrients.ENERC_KCAL} type={'preview'}/>
        )
    })

    return (
        <PageGrid>
            {foodList}
        </PageGrid>
    )
}

export default Food