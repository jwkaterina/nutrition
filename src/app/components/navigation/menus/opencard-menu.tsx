'use client'

import { SlideType } from "@/app/types/types"
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext, useFoodDispatch } from '@/app/context/food-context'
import { useRecipeDispatch } from '@/app/context/recipe-context'
// import { useMenuDispatch } from '@/app/context/menu-context'
import { SlideContext } from '@/app/context/slide-context';
import Menu from "./menu"

interface OpenCardMenuProps {
}

const OpenCardMenu = ({ }: OpenCardMenuProps): JSX.Element => {

    const slide = useContext(SlideContext);
    const cardOpen = useContext(SetCardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const currentFood = useContext(CurrentFoodContext);
    // const foodDispatch = useFoodDispatch();
    // const recipeDispatch = useRecipeDispatch();
    // const menuDispatch = useMenuDispatch();

    const deleteCard = (index: number | null): void => {
        setCardOpen(0);
        switch(slide) {
            case SlideType.FOOD:
                // deleteFood(index);
                break;
            case SlideType.RECIPE:
                // deleteRecipe(index);
                break;
            case SlideType.MENU:
                // deleteMenu(index);
                break;
        }
    }

    // const deleteFood = (index: number | null): void => {
    //     foodDispatch({type: 'delete', id: currentFood});
    // }

    // const deleteRecipe = (index: number | null): void => {
    //     recipeDispatch({type: 'delete', index: index! - 1});
    // }

    // const deleteMenu = (index: number | null): void => {
    //     menuDispatch({type: 'delete', index: index! - 1})
    // }

    return <Menu 
        leftText="Back" 
        rightText="Delete" 
        onLeftclick={() => setCardOpen(0)} 
        onRightclick={() => deleteCard(cardOpen)} 
    />
}

export default OpenCardMenu