'use client'

import { useContext, useState } from "react"
import { CardOpenContext, SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch, CurrentFoodContext } from "@/app/context/food-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState('Add To Favorites');
    const router = useRouter();

    const cardOpen = useContext(CardOpenContext);
    const currentFood = useContext(CurrentFoodContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();

    const addToFavorites = (): void => {
        const Food = {
            food: {
                foodId: currentFood.food.foodId,
                label: currentFood.food.label,
                image: currentFood.food.image,
                nutrients: {
                    ENERC_KCAL: currentFood.food.nutrients.ENERC_KCAL,
                    PROCNT: currentFood.food.nutrients.PROCNT,
                    FAT: currentFood.food.nutrients.FAT,
                    CHOCDF: currentFood.food.nutrients.CHOCDF,
                    FIBTG: currentFood.food.nutrients.FIBTG
                },
            },
            measures: currentFood.measures
        };
        foodDispatch({type: 'add', item: Food});
        setRightText('Go To Favorites');
    }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(null);
            router.push('/');
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