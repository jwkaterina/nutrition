import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useHttpClient } from '@/app/hooks/http-hook';
import FoodHeaderCard from './header-foodcard';
import food from '@/app/test_objects/food1.json';
import measures from '@/app/test_objects/mesures.json';
import { FoodType } from '@/app/types/types';

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('food header card', () => {

    const mockeduseHttpClient = useHttpClient as jest.Mock;

    it('should render food header card', async() => {

        let callCount = 0;
        mockeduseHttpClient.mockReturnValue({
            sendRequest: () => {
                return measures[callCount++ % measures.length]; 
                //The modulo operator (%) ensures that callCount doesn't go beyond the length of the measures array.
            }
            });

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
            option: 'Value pre 100g',
            setOption: jest.fn(),
            setMeasure: jest.fn(),
            quantity: 1,
            setQuantity: jest.fn(),
            blockSelect: false
        };

        render(<FoodHeaderCard {... props} />);

        let input = screen.queryByRole('spinbutton');
        const select = await screen.findByRole('combobox');
        const options = select.children;
        const optionLength = measures.length - 5 + 2;
        expect(options.length).toBe(optionLength);
        expect(options[0]).toHaveTextContent(props.option);
        expect(options[optionLength - 1]).toHaveTextContent('Custom weight');
        expect(input).not.toBeInTheDocument();

        await user.selectOptions(select, 'Custom weight');
        expect(options[0]).toHaveTextContent('grams');
        expect(options[optionLength - 1]).toHaveTextContent('Value pre 100g');
        expect(props.setMeasure).toHaveBeenCalledWith('custom');
        expect(props.setOption).toHaveBeenCalledWith('grams');
        expect(props.setQuantity).toHaveBeenCalledWith(100);
        input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(1);
        
        await user.type(input, '5')
        expect(props.setQuantity).toHaveBeenCalledWith(15);

    })
})