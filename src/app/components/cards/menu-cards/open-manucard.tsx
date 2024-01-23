import styles from '../card.module.css'
import { Menu } from '@/app/types/types'
import MenuHeaderCard from './header-menucard'
import DailyValueCard from '../../analysis_cards/dailyvalue_card'
import CompositionCard from '../../analysis_cards/composition_card'
import BigNutrientsCard from '../../analysis_cards/bignutrients_card'
import VitaminsCard from '../../analysis_cards/vitamins_card'
import MineralsCard from '../../analysis_cards/minerals_card'
import FatsCard from '../../analysis_cards/fats_card'

interface OpenMenuCardProps {
    menu: Menu
}

const OpenMenuCard  = ({ menu }: OpenMenuCardProps): JSX.Element => {

    const weight: number = menu.nutrients.totalWeight;
    const devideBy: number = weight / 100;

    const proteinPer100gram: number = menu.nutrients.totalNutrients.PROCNT.quantity / devideBy;
    const carbsPer100gram: number = menu.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
    const fatPer100gram: number = menu.nutrients.totalNutrients.FAT.quantity / devideBy;

    return (
        <div className={styles.card_grid}>
            <MenuHeaderCard menu={menu} />
            {menu && <DailyValueCard content={menu.nutrients} />}
            <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            />
            {menu && <BigNutrientsCard content={menu.nutrients} />}
            {menu && <VitaminsCard content={menu.nutrients} />}
            {menu && <MineralsCard content={menu.nutrients} />}
            {menu && <FatsCard content={menu.nutrients} />}
        </div>
    )
}

export default OpenMenuCard