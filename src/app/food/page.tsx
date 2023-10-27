'use client'

import { useEffect, useRef } from 'react'
import styles from './page.module.css'
import FoodList from '@/app/data-base/food-list'
import PageGrid from '../components/page-grid'
import Card from '../components/card'
import { Slide } from '@/app/page'

const Food = () => {

    const foodList = FoodList.map(food => {
        return (
            <Card title={food.label} text={food.nutrients.ENERC_KCAL} type={'preview'} key={food.foodId}/>
        )
    })

    return (
        <PageGrid >
            {foodList}
        </PageGrid>
    )
}

export default Food