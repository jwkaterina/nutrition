'use client'

import { useContext } from "react"
import { CardOpenContext, SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch } from "@/app/context/food-context"
import Menu from './menu'
import { Food } from "@/app/types/types"

interface OpenAnalysisMenuProps {
    foodArray: Food[]
}

const OpenAnalysisMenu = ({ foodArray }: OpenAnalysisMenuProps): JSX.Element => {

    const cardOpen = useContext(CardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();

    const addToFavorites = (): void => {
        const index = cardOpen;
        const cardFood = foodArray[index! - 1];
        console.log(cardFood);
        const Food = {
            food: {
                foodId: cardFood.food.foodId,
                label: cardFood.food.label,
                image: cardFood.food.image,
                nutrients: {
                    ENERC_KCAL: cardFood.food.nutrients.ENERC_KCAL,
                    PROCNT: cardFood.food.nutrients.PROCNT,
                    FAT: cardFood.food.nutrients.FAT,
                    CHOCDF: cardFood.food.nutrients.CHOCDF,
                    FIBTG: cardFood.food.nutrients.FIBTG
                },
            },
            measures: cardFood.measures
        };
        foodDispatch({type: 'add', item: Food});
    }

    return <Menu 
        leftText='Back' 
        rightText='Add To Favorites' 
        onLeftclick={() => setCardOpen(0)} 
        onRightclick={() => addToFavorites()}
    />
}

export default OpenAnalysisMenu