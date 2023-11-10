'use client'

import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch } from "@/app/context/food-context"
import Menu from './menu'

interface OpenAnalysisMenuProps {
    foodArray: any[]
}

const OpenAnalysisMenu = ({ foodArray }: OpenAnalysisMenuProps): JSX.Element => {

    const cardOpen = useContext(SetCardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();

    const addToFavorites = (index: number | null): void => {
        const cardFood = foodArray[index! - 1];
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

    return <Menu 
        leftText='Back' 
        rightText='Add To Favorites' 
        onLeftclick={() => setCardOpen(0)} 
        onRightclick={() => addToFavorites(cardOpen)}
    />
}

export default OpenAnalysisMenu