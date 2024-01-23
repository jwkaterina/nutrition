import { Menu, CardState } from '@/app/types/types'
import Card from '../card'
import { useContext, useState } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { CurrentMenuContext } from '@/app/context/menu-context'
import OpenMenuCard from './open-manucard'
import ClosedCard from '../closed-card'

interface MenuCardProps {
    menu: Menu,
    index: number,
    id: string | null,
    open: boolean
}

const MenuCard = ({ menu, index, id, open }: MenuCardProps): JSX.Element => {

    const [isOpen, setIsOpen] = useState<boolean>(open);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setCurrentMenu } = useContext(CurrentMenuContext);

    const handleCardClick = () => {
        if(isOpen) {
            return 
        }
        setCardOpen(CardState.OPEN);
        setIsOpen(true); 

        setCurrentMenu({
            menu: menu,
            id: id
        });
    }

    return <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen ? <OpenMenuCard menu={menu}/> : 
            <ClosedCard 
                title={menu.name}
                calories={menu.nutrients.calories}
                protein={menu.nutrients.totalNutrients.PROCNT.quantity}
                fat={menu.nutrients.totalNutrients.FAT.quantity}
                carbs={menu.nutrients.totalNutrients.CHOCDF.quantity}
            />}
        </Card>
}

export default MenuCard