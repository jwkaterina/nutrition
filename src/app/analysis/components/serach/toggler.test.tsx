import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Toggler from './toggler';
import { FoodType } from '@/app/types/types';

describe('toggler', () => {

    it('should render toggler and add to filter', async() => {

        const props = {
            foodType: FoodType.FAST_FOODS,
            setFilter: jest.fn(),
            filter: [FoodType.GENERIC_FOODS, FoodType.GENERIC_MEALS]
        }
        
        render(<Toggler {...props} />);

        const toggler = screen.getByRole('checkbox');
        
        expect(toggler).toBeInTheDocument();
        expect(toggler).not.toBeChecked();

        await user.click(toggler);

        expect(props.setFilter).toHaveBeenCalledWith([FoodType.GENERIC_FOODS, FoodType.GENERIC_MEALS, FoodType.FAST_FOODS]);
    });

    it('should remove from filter', async() => {

        const props = {
            foodType: FoodType.GENERIC_MEALS,
            setFilter: jest.fn(),
            filter: [FoodType.GENERIC_FOODS, FoodType.GENERIC_MEALS]
        }
        
        render(<Toggler {...props} />);

        const toggler = screen.getByRole('checkbox');
        
        expect(toggler).toBeInTheDocument();
        expect(toggler).toBeChecked();

        await user.click(toggler);

        expect(props.setFilter).toHaveBeenCalledWith([FoodType.GENERIC_FOODS]);
    });

});