'use client';
import { useContext, useState } from 'react';
import Card from '../card';
import ClosedCard from '../closed-card';
import OpenMenuCard from './open-menucard';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { MenuProp, CardState, AnalysisMode } from '@/app/types/types';

interface MenuCardProps {
    menu: MenuProp,
    index: number,
    id: string | null,
    open: boolean,
    image?: string | null,
}

const MenuCard = ({ menu, index, id, open, image = null }: MenuCardProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const { setCurrentMenu } = useContext(CurrentMenuContext);
    const [isOpen, setIsOpen] = useState<boolean>(open);

    const handleCardClick = () => {
        if(isOpen) {
            return 
        }
        setCardOpen(CardState.OPENING);
        setIsOpen(true); 

        setCurrentMenu({
            menu: menu,
            id: id,
            mode: AnalysisMode.VIEW
        });
    }

    return (
        <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen && cardOpen !== CardState.CLOSING ? <OpenMenuCard menu={menu} image={image}/> : <ClosedCard
                title={menu.name}
                calories={menu.nutrients?.calories ?? 0}
                protein={menu.nutrients?.totalNutrients?.PROCNT?.quantity ?? 0}
                fat={menu.nutrients?.totalNutrients?.FAT?.quantity ?? 0}
                carbs={menu.nutrients?.totalNutrients?.CHOCDF?.quantity ?? 0}
                image={image}
            />}
        </Card>
    );
}

export default MenuCard;