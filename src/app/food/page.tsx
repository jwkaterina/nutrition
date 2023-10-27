'use client'

import styles from './page.module.css'
import { FoodList } from '@/app/data-base/food-list'

const Food = () => {

    const foodList = FoodList.map(food => {
        return (
            <div className={styles.card}>
                <h2>{food.label}</h2>
                <p>{food.nutrients.ENERC_KCAL}</p>
            </div>
        )
    })

    return (
        <div>
            <h1 className='title'>Food</h1>
            <div className={styles.grid}>
                {foodList}
            </div>

        </div>
    );
}

export default Food