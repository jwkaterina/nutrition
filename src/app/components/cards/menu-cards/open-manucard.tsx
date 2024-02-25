import BigNutrientsCard from '../../analysis_cards/bignutrients_card';
import CompositionCard from '../../analysis_cards/composition_card';
import DailyValueCard from '../../analysis_cards/dailyvalue_card';
import FatsCard from '../../analysis_cards/fats_card';
import MenuHeaderCard from './header-menucard';
import MineralsCard from '../../analysis_cards/minerals_card';
import VitaminsCard from '../../analysis_cards/vitamins_card';
import { MenuProp } from '@/app/types/types';
import styles from '../card.module.css';

interface OpenMenuCardProps {
    menu: MenuProp
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
            {menu.nutrients && <DailyValueCard content={menu.nutrients} />}
            <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            />
            {menu.nutrients && <BigNutrientsCard content={menu.nutrients} />}
            {menu.nutrients && <VitaminsCard content={menu.nutrients} />}
            {menu.nutrients && <MineralsCard content={menu.nutrients} />}
            {menu.nutrients && <FatsCard content={menu.nutrients} />}
        </div>
    );
}

export default OpenMenuCard;