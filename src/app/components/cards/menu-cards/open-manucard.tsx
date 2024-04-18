import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import CompositionCard from '../../analysis-cards/composition-card';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import FatsCard from '../../analysis-cards/fats-card';
import MenuHeaderCard from './header-menucard';
import MineralsCard from '../../analysis-cards/minerals-card';
import VitaminsCard from '../../analysis-cards/vitamins-card';
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