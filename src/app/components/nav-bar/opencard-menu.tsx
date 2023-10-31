'use client'

import styles from './nav-bar.module.css'
import { Slide } from "@/app/types/types"
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { useFoodDispatch } from '@/app/context/food-context'
import { useRecipeDispatch } from '@/app/context/recipe-context'
import { useMenuDispatch } from '@/app/context/menu-context'

interface OpenCardMenuProps {
    slide: Slide,
    cardOpen: number | null,
}

const OpenCardMenu = ({ slide, cardOpen }: OpenCardMenuProps): JSX.Element => {

    const setCardOpen = useContext(SetCardOpenContext);
    const foodDispatch = useFoodDispatch();
    const recipeDispatch = useRecipeDispatch();
    const menuDispatch = useMenuDispatch();

    const deleteCard = (index: number | null): void => {
        setCardOpen(0);
        switch(slide) {
            case Slide.FOOD:
                deleteFood(index);
                break;
            case Slide.RECIPE:
                deleteRecipe(index);
                break;
            case Slide.MENU:
                deleteMenu(index);
                break;
        }
    }

    const deleteFood = (index: number | null): void => {
        foodDispatch({type: 'delete', index: index! - 1});
    }

    const deleteRecipe = (index: number | null): void => {
        recipeDispatch({type: 'delete', index: index! - 1});
    }

    const deleteMenu = (index: number | null): void => {
        menuDispatch({type: 'delete', index: index! - 1})
    }

    return <>
        <div className={styles.links}>
            <a className={styles.link} onClick={() => setCardOpen(0)}>Back</a>
            <a className={styles.link} onClick={() => deleteCard(cardOpen)} >Delete</a>
        </div>
    </>
}

export default OpenCardMenu