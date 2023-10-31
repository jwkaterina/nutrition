'use client'

import styles from './nav-bar.module.css'
import { Slide } from "@/app/types/types"
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/context"
import { FoodProp, RecipeProp, MenuProp } from "@/app/types/types"

interface OpenCardMenuProps {
    slide: Slide,
    cardOpen: number | null,
}

const OpenCardMenu = ({ slide, cardOpen }: OpenCardMenuProps): JSX.Element => {
    const setCardOpen = useContext(SetCardOpenContext);

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
    localStorage.setItem('food', JSON.stringify(JSON.parse(localStorage.getItem('food')!).filter((food: FoodProp, i: number) => i != index! - 1)))
}

const deleteRecipe = (index: number | null): void => {
    localStorage.setItem('recipes', JSON.stringify(JSON.parse(localStorage.getItem('recipes')!).filter((recipe: RecipeProp, i: number) => i != index! - 1)))
}

const deleteMenu = (index: number | null): void => {
    localStorage.setItem('menus', JSON.stringify(JSON.parse(localStorage.getItem('menus')!).filter((menu: MenuProp, i: number) => i != index! - 1)))
}
    return <>
        <div className={styles.links}>
            <a className={styles.link} onClick={() => setCardOpen(0)}>Back</a>
            <a className={styles.link} onClick={() => deleteCard(cardOpen)} >Delete</a>
        </div>
    </>
}

export default OpenCardMenu