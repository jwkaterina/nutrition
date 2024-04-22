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
    open: boolean
}

const MenuCard = ({ menu, index, id, open }: MenuCardProps): JSX.Element => {

    const { setCardOpen } = useContext(CardOpenContext);
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
            {isOpen ? <OpenMenuCard menu={menu}/> : <ClosedCard 
                title={menu.name}
                calories={menu.nutrients.calories}
                protein={menu.nutrients.totalNutrients.PROCNT.quantity}
                fat={menu.nutrients.totalNutrients.FAT.quantity}
                carbs={menu.nutrients.totalNutrients.CHOCDF.quantity}
                image={null}
            />}
        </Card>
    );
}

export default MenuCard;