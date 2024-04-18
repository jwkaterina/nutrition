import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MineralsCard from './minerals-card';
import emptyNutrients from '@/app/test_objects/empty-nutrients.json';
import nutrients from '@/app/test_objects/nutrients1.json';
import CircleRow from './diagrams/circle-row';
import BarColumn from './diagrams/bar-column';

jest.mock('./diagrams/circle-row');
jest.mock('./diagrams/bar-column');

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

describe('minerals card', () => {

    it('should render empty card', () => {
        const props = {
            content: emptyNutrients
        }
        render(<MineralsCard {...props} />)
        screen.logTestingPlaygroundURL();

        const heading = screen.getByRole('heading', {
            name: /minerals/i
        });
        const text = screen.getByText(/no information available\./i);
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    });

    it('should render card with CircleRow for small screen', () => {
     
        const props = {
            content: nutrients
        }
        render(<MineralsCard {...props} />)

        expect(CircleRow).toHaveBeenCalledTimes(7);
    });

    it('should render card with BarColumns for large screen', () => {
     
        (window.matchMedia as jest.Mock).mockImplementation(query => ({
            matches: query === '(min-width: 500px)',
            media: query,
        }));
        
        const props = {
            content: nutrients
        }
        render(<MineralsCard {...props} />)

        expect(BarColumn).toHaveBeenCalledTimes(7);
    });
})