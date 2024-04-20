import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FoodCard from './food-card';
import food from '@/app/test_objects/food1.json';
import nutrients from '@/app/test_objects/nutrients1.json'
import { FoodType, CardState } from '@/app/types/types';
import { useHttpClient } from '@/app/hooks/http-hook';
import { CurrentFoodContext } from '@/app/context/food-context';
import { CardOpenContext } from '@/app/context/card-context';
import OpenFoodCard from './open-foodcard';

jest.mock('./open-foodcard');


Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('food card', () => {

    const mockeduseHttpClient = useHttpClient as jest.Mock;

    it('should render food card', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

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
            index: 5,
            id: null,
            open: false
        };

        render(<FoodCard {... props} />);

        const closedCardImg = screen.getByRole('img');

        expect(closedCardImg).toBeInTheDocument();
        expect(OpenFoodCard).not.toHaveBeenCalled();
    })

    it('should render food card without image when extension is wrong', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const props = {
            food: {
                food: {
                    nutrients: food.food.nutrients,
                    category: FoodType.GENERIC_FOODS,
                    categoryLabel: "food",
                    foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd",
                    image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6",
                    knownAs: "apple",
                    label: "Apple"
                },
                measures: food.measures
            },
            index: 5,
            id: null,
            open: false
        };

        render(<FoodCard {... props} />);

        const closedCardImg = screen.queryByRole('img');

        expect(closedCardImg).not.toBeInTheDocument();
        expect(OpenFoodCard).not.toHaveBeenCalled();

    })

    it('should render open food card when is open and do not handle click', async() => {

        HTMLElement.prototype.animate = jest.fn();
        mockeduseHttpClient.mockReturnValue({sendRequest: nutrients});

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
            index: 5,
            id: null,
            open: true
        };

        const setCurrentFood = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.OPEN,
                setCardOpen: setCardOpen
            }}>
                <CurrentFoodContext.Provider value={{
                    currentFood: {
                        food: null,
                        id: null
                    },
                    setCurrentFood: setCurrentFood
                }}>
                    <FoodCard {... props} />
                </CurrentFoodContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenFoodCard).toHaveBeenCalledTimes(1);
        expect(OpenFoodCard).toHaveBeenCalledWith({food: props.food, initialNutrients: null}, {});

        await user.click(card!);
        expect(setCurrentFood).not.toHaveBeenCalled();
        expect(setCardOpen).not.toHaveBeenCalled();
    })

    it('should open card on click', async() => {

        HTMLElement.prototype.animate = jest.fn();
        mockeduseHttpClient.mockReturnValue({sendRequest: () => nutrients});

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
            index: 5,
            id: null,
            open: false
        };

        const setCurrentFood = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.CLOSED,
                setCardOpen: setCardOpen
            }}>
                <CurrentFoodContext.Provider value={{
                    currentFood: {
                        food: null,
                        id: null
                    },
                    setCurrentFood: setCurrentFood
                }}>
                    <FoodCard {... props} />
                </CurrentFoodContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenFoodCard).not.toHaveBeenCalled();

        await user.click(card!);
        screen.logTestingPlaygroundURL();

        expect(setCurrentFood).toHaveBeenCalledWith({food: props.food, id: props.id});
        expect(setCardOpen).toHaveBeenCalledWith(CardState.OPENING);
        expect(OpenFoodCard).toHaveBeenCalledWith({food: props.food, initialNutrients: nutrients}, {});

    })
})