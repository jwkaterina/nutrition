'use client'

import styles from './nav-bar.module.css'
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch } from "@/app/context/food-context"

interface OpenCardMenuProps {
    cardOpen: number | null,
    foodArray: any[]
}

const AnalysisMenu = ({ cardOpen, foodArray }: OpenCardMenuProps): JSX.Element => {

    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();

    const addToFavorites = (index: number | null): void => {
        const cardFood = foodArray[index! - 1];
        console.log(cardFood);
        const food = {
            foodId: cardFood.food.foodId,
			label: cardFood.food.label,
			image: cardFood.food.image,
			nutrients: {
				ENERC_KCAL: cardFood.food.nutrients.ENERC_KCAL,
				PROCNT: cardFood.food.nutrients.PROCNT,
				FAT: cardFood.food.nutrients.FAT,
				CHOCDF: cardFood.food.nutrients.CHOCDF,
				FIBTG: cardFood.food.nutrients.FIBTG
			}
        };
        foodDispatch({type: 'add', item: food});
        console.log(food);
    }

    return <>
        <div className={styles.links}>
            <a className={styles.link} onClick={() => setCardOpen(0)}>Back</a>
            <a className={styles.link} onClick={() => addToFavorites(cardOpen)} >Add To Favorites</a>
        </div>
    </>
}

export default AnalysisMenu