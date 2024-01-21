'use client'

import { useContext, useState } from 'react' 
import NavBar from '@/app/components/navigation/nav-bar';
import Slider from '@/app/components/slider/slider';
import MainNav from '@/app/components/navigation/main-nav';
import OpenCardMenu from '@/app/components/navigation/menus/opencard-menu';
import { CardOpenContext } from './context/card-context';
import Footer from './components/navigation/footer';
import { CardState } from './types/types';

export default function Home(): JSX.Element {

    const { cardOpen } = useContext(CardOpenContext);
    const [deletedFood, setDeletedFood] = useState<boolean>(false);
    const [deletedRecipe, setDeletedRecipe] = useState<boolean>(false);
    const [deletedMenu, setDeletedMenu] = useState<boolean>(false);

    const primaryColor = "var(--primary-color)";

    return (
        <>
            <NavBar color={primaryColor}>
                {cardOpen == CardState.OPEN ? 
                    <OpenCardMenu 
                        onFoodDelete={() => setDeletedFood(true)}
                        onRecipeDelete={() => setDeletedRecipe(true)}
                        onMenuDelete={() => setDeletedMenu(true)}
                    /> : 
                    <MainNav/>}
            </NavBar>
            <Slider 
                foodDeleted={deletedFood} 
                recipeDeleted={deletedRecipe}
                menuDeleted={deletedMenu}
            />
            {cardOpen != CardState.OPEN && <Footer color={primaryColor} />}
        </>
    )
}
