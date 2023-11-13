'use client'

import { useContext, useState } from "react"
import { CardOpenContext, SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch } from "@/app/context/food-context"
import Menu from './menu'
import { Food } from "@/app/types/types"
import { useRouter } from 'next/navigation'

interface OpenAnalysisMenuProps {
    foodArray: Food[]
}

const OpenAnalysisMenu = ({ foodArray }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState('Add To Favorites');
    const router = useRouter();

    const cardOpen = useContext(CardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();

    const addToFavorites = (): void => {
        const index = cardOpen;
        const cardFood = foodArray[index! - 1];
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
        setRightText('Go To Favorites');
    }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(0);
            setTimeout(() => {
            router.push('/')}, 300);
        }
    }

    return <Menu 
        leftText='Back' 
        rightText={rightText} 
        onLeftclick={() => setCardOpen(0)} 
        onRightclick={handleRightClick}
    />
}

export default OpenAnalysisMenu