import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClosedCard from './closed-card';

describe('closed card', () => {

    it('should render card', () => {
        const props = {
            title: 'Apple',
            image: 'https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg',
            calories: 56.27,
            protein: 23.45,
            fat: 12.2,
            carbs: 34.05
        };

        render(<ClosedCard {... props} />);

        const img = screen.getByRole('img');
        const calories = screen.getByText(/56/i);
        const protein = screen.getByText(/23/i);
        const fat = screen.getByText(/12/i);
        const carbs = screen.getByText(/34/i);

        expect(img).toBeInTheDocument();
        expect(calories).toBeInTheDocument();
        expect(protein).toBeInTheDocument();
        expect(fat).toBeInTheDocument();
        expect(carbs).toBeInTheDocument();
    })
})