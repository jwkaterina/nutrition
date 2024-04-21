import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenMenuCard from './open-menucard';
import MenuHeaderCard from './header-menucard';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import CompositionCard from '../../analysis-cards/composition-card';
import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import VitaminsCard from '../../analysis-cards/vitamins-card';
import MineralsCard from '../../analysis-cards/minerals-card';
import FatsCard from '../../analysis-cards/fats-card';
import menu from '@/app/test_objects/menu1.json'

jest.mock('./header-menucard');
jest.mock('../../analysis-cards/dailyvalue-card');
jest.mock('../../analysis-cards/composition-card');
jest.mock('../../analysis-cards/bignutrients-card');
jest.mock('../../analysis-cards/vitamins-card');
jest.mock('../../analysis-cards/minerals-card');
jest.mock('../../analysis-cards/fats-card');

describe('open menu card', () => {

    it('should render open menu card', async() => {

        const props = {
           menu: menu.menu
        };

        const weight: number = menu.menu.nutrients.totalWeight;
        const devideBy: number = weight / 100;
    
        const proteinPer100gram: number = menu.menu.nutrients.totalNutrients.PROCNT.quantity / devideBy;
        const carbsPer100gram: number = menu.menu.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
        const fatPer100gram: number = menu.menu.nutrients.totalNutrients.FAT.quantity / devideBy;
        render(<OpenMenuCard {...props} />);

        expect(MenuHeaderCard).toHaveBeenCalled();
        expect(DailyValueCard).toHaveBeenCalledWith({content: props.menu.nutrients}, {});
        expect(BigNutrientsCard).toHaveBeenCalledWith({content: props.menu.nutrients}, {});
        expect(VitaminsCard).toHaveBeenCalledWith({content: props.menu.nutrients}, {});
        expect(MineralsCard).toHaveBeenCalledWith({content: props.menu.nutrients}, {});
        expect(FatsCard).toHaveBeenCalledWith({content: props.menu.nutrients}, {});
        expect(CompositionCard).toHaveBeenCalledWith({protein: proteinPer100gram, carbs: carbsPer100gram, fat: fatPer100gram}, {})
    });
})