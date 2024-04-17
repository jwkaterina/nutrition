import { render, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodList from './food-list';
import { SortType, FoodType } from '@/app/types/types';
import food_1 from '@/app/test_objects/food1.json';
import food_2 from '@/app/test_objects/food2.json';

describe('food-list', () => {

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: query === '(max-width: 500px)',
            media: query,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))
    });

    const food1 = {
        food: {
            nutrients: food_1.food.nutrients,
            category: FoodType.GENERIC_FOODS,
            categoryLabel: "food",
            foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd",
            image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg",
            knownAs: "apple",
            label: "Apple"
        },
        measures: food_1.measures
    };
    const food2 = {
        food: {
            nutrients: food_2.food.nutrients,
            category: FoodType.GENERIC_FOODS,
            categoryLabel: "food",
            foodId: "food_bpumdjzb5rtqaeabb0kbgbcgr4t9",
            image: "https://www.edamam.com/food-img/0fc/0fc9fa8a3e0276198d75b2e259068f8a.jpg",
            knownAs: "rice",
            label: "Rice"
        },
        measures: food_2.measures
    };

    const props = {
        foodArr: [food1, food2],
        sort: SortType.ASC_Calories
    }
    
    const { container } = render(<FoodList {...props} />);

    it('should render food list in caloreis ascending order', () => {
        const cards = container.querySelectorAll('.card');

        expect(cards).toHaveLength(2);
        const firstCaloriesHeading = within(cards[0] as HTMLElement).getByRole('heading', { name: /kcal/i });
        const firstCaloriesNumber = firstCaloriesHeading.nextElementSibling;
        const secondCaloriesHeading = within(cards[1] as HTMLElement).getByRole('heading', { name: /kcal/i });
        const secondCaloreisNumber = secondCaloriesHeading.nextElementSibling;
        expect(firstCaloriesNumber).toHaveTextContent('360');
        expect(secondCaloreisNumber).toHaveTextContent('52');
    });

});