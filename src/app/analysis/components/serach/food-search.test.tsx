import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FoodSearch from './food-search';
import { useHttpClient } from '@/app/hooks/http-hook';
import hints from '@/app/test_objects/hints.json';

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

Object.defineProperty(window, 'matchMedia', {value: jest.fn()});

describe('food search', () => {

    const mockeduseHttpClient = useHttpClient as jest.Mock;

    mockeduseHttpClient.mockImplementation(() => ({
        sendRequest: (url: string, ...args: any) => {
            if (url.startsWith('/api/query/')) {
                return ['banket', 'banana', 'bangda'];
            } else if (url.startsWith('/api/ingr/')) {
                return { hints: hints };
            }
        }
    }));

    const props = {
        searchCleared: false,
        setClearSearch: jest.fn()
    }
    
    it('should render food search, show options on click, display cards on option click', async() => {

        const { container } = render(<FoodSearch {...props} />);

        const input = screen.getByRole('textbox');
        const searchIcon = container.querySelector('.searchIcon');
        const sortButtons = container.querySelector('.sort_buttons');

        expect(input).toBeInTheDocument();
        expect(searchIcon).toBeInTheDocument();
        expect(sortButtons).toBeInTheDocument();

        await user.click(input);
        const backIcon = container.querySelector('.backIcon');
        const deleteIcon = container.querySelector('.deleteIcon');
        const options = container.querySelector('.options');
        expect(backIcon).toBeInTheDocument();
        expect(deleteIcon).toBeInTheDocument();
        expect(options).toBeInTheDocument();

        await user.type(input, 'ban');
        const listItems = screen.getAllByRole('listitem');

        expect(input).toHaveValue('ban');
        expect(listItems).toHaveLength(3);
        expect(listItems[0]).toHaveTextContent(/banket/i);
        expect(listItems[1]).toHaveTextContent(/banana/i);
        expect(listItems[2]).toHaveTextContent(/bangda/i); 

        await user.click(listItems[1]);
        const cards = container.querySelectorAll('.card');

        expect(cards).toHaveLength(hints.length);
        expect(input).toHaveValue('banana');

    });

    it('should display cards on enter key', async() => {

        const { container } = render(<FoodSearch {...props} />);

        const input = screen.getByRole('textbox');
        await user.click(input);
        await user.type(input, 'banana');
        await user.keyboard('{Enter}');

        const cards = container.querySelectorAll('.card');

        expect(cards).toHaveLength(hints.length);
        expect(input).toHaveValue('banana');
    });

    it('should display cards on enter key', async() => {

        const { container } = render(<FoodSearch {...props} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'ban');

        const backIcon = container.querySelector('.backIcon');

        await user.click(backIcon!);

        expect(input).toHaveValue('');
        screen.logTestingPlaygroundURL();

    });

});