import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BigNutrientsCard from './bignutrients-card';
import emptyNutrients from '@/app/test_objects/empty-nutrients.json';
import nutrients from '@/app/test_objects/nutrients1.json';
import BarRow from './diagrams/bar-row';

jest.mock('./diagrams/bar-row');

describe('bignurients', () => {

    it('should render empty card', () => {
        const props = {
            content: emptyNutrients
        }
        render(<BigNutrientsCard {...props} />)
        screen.logTestingPlaygroundURL();

        const heading = screen.getByRole('heading', {
            name: /big nutrients/i
        });
        const text = screen.getByText(/no information available\./i);
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    })

    it('should render card with bar rows', () => {
        const props = {
            content: nutrients
        }
        const { container } = render(<BigNutrientsCard {...props} />)
        screen.logTestingPlaygroundURL();

        expect(BarRow).toHaveBeenCalledTimes(5);
    })
})