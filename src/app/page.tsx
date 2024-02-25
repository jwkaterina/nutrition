'use client'

import { useContext, useState } from 'react' ;
import Footer from './components/navigation/footer';
import MainNav from '@/app/components/navigation/main-nav';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenCardMenu from '@/app/components/navigation/menus/opencard-menu';
import Slider from '@/app/components/slider/slider';
import { CardOpenContext } from './context/card-context';
import { CardState } from './types/types';

export default function Home(): JSX.Element {

    const { cardOpen } = useContext(CardOpenContext);
    const [deletedFood, setDeletedFood] = useState<boolean>(false);

    const primaryColor = "var(--primary-color)";

    return (
        <>
            <NavBar color={primaryColor}>
                {cardOpen == CardState.OPEN ? 
                    <OpenCardMenu 
                        onFoodDelete={() => setDeletedFood(true)}
                    /> : 
                    <MainNav/>}
            </NavBar>
            <Slider 
                foodDeleted={deletedFood} 
            />
            <Footer color={primaryColor} />
        </>
    );
}
