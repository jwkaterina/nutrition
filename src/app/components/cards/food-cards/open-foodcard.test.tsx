import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenFoodCard from './open-foodcard';
import food from '@/app/test_objects/food1.json';
import { FoodType } from '@/app/types/types';
import nutrients from '@/app/test_objects/nutrients1.json';
import FoodHeaderCard from './header-foodcard';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import CompositionCard from '../../analysis-cards/composition-card';
import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import VitaminsCard from '../../analysis-cards/vitamins-card';
import MineralsCard from '../../analysis-cards/minerals-card';
import FatsCard from '../../analysis-cards/fats-card';
import { useHttpClient } from '@/app/hooks/http-hook';

jest.mock('./header-foodcard');
jest.mock('../../analysis-cards/dailyvalue-card');
jest.mock('../../analysis-cards/composition-card');
jest.mock('../../analysis-cards/bignutrients-card');
jest.mock('../../analysis-cards/vitamins-card');
jest.mock('../../analysis-cards/minerals-card');
jest.mock('../../analysis-cards/fats-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('open food card', () => {

    const sendRequest = jest.fn();

    (useHttpClient as jest.Mock).mockReturnValue({
        sendRequest: sendRequest
    });
    it('should render open food care', async() => {

        const props = {
            food: {
                food: {
                    nutrients: food.food.nutrients,
                    category: FoodType.GENERIC_FOODS,
                    categoryLabel: "food",
                    foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd",
                    image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg",
                    knownAs: "apple",
                    label: "Apple"
                },
                measures: food.measures
            },
            initialNutrients: null
        };

        render(<OpenFoodCard {...props} />);

        const gramUri: string = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

        expect(FoodHeaderCard).toHaveBeenCalled();
        expect(DailyValueCard).toHaveBeenCalledWith({content: props.initialNutrients}, {});
        expect(BigNutrientsCard).toHaveBeenCalledWith({content: props.initialNutrients}, {});
        expect(VitaminsCard).toHaveBeenCalledWith({content: props.initialNutrients}, {});
        expect(MineralsCard).toHaveBeenCalledWith({content: props.initialNutrients}, {});
        expect(FatsCard).toHaveBeenCalledWith({content: props.initialNutrients}, {});
        expect(CompositionCard).toHaveBeenCalledWith({protein: props.food.food.nutrients.PROCNT, carbs: props.food.food.nutrients.CHOCDF, fat: props.food.food.nutrients.FAT}, {});
        expect(sendRequest).toHaveBeenCalledWith(      
            `/api/nutrients`,
            'POST',
            JSON.stringify({
                foodId: food.food.foodId, 
                measure: gramUri, 
                quantity: 100
            }),
            { 'Content-Type': 'application/json' },
            false, false);
    });
})