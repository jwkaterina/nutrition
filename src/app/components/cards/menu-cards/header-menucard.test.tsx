import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MenuHeaderCard from './header-menucard';
import menu from '@/app/test_objects/menu1.json';

describe('food header card', () => {

    it('should render food header card', async() => {

        const props = {
            menu: menu.menu
        };

        render(<MenuHeaderCard {... props} />);

        screen.logTestingPlaygroundURL();
        const heading = screen.getByRole('heading');
        const weight = props.menu.nutrients.totalWeight;
        const text = screen.getByText(new RegExp(`1 serving \\- ${weight}g`, 'i'));
        
        expect(text).toBeInTheDocument();
        expect(heading).toHaveTextContent(props.menu.name);

    })
})