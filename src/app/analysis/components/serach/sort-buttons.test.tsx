import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SortButtons from './sort-buttons';
import { FoodType, SortType } from '@/app/types/types';

describe('sort buttons', () => {

    it('should render sort buttons', async() => {

        const props = {
            setSort: jest.fn(),
            setFilter: jest.fn(),
            filter: [FoodType.GENERIC_FOODS, FoodType.GENERIC_MEALS],
            isOpen: true,
            setOpen: jest.fn()
        }
        
        const { container } = render(<SortButtons {...props} />);
        screen.logTestingPlaygroundURL();

        const dropDownMenu = container.querySelector('.dropdown_content');
        const select = screen.getByRole('combobox');
        
        expect(dropDownMenu).toBeInTheDocument();
        expect(select).toBeInTheDocument();

        await user.click(container);
        expect(props.setOpen).toHaveBeenCalledWith(false);

        await user.selectOptions(select, 'More Calories');
        expect(props.setSort).toHaveBeenLastCalledWith(SortType.ASC_Calories)

    });

});