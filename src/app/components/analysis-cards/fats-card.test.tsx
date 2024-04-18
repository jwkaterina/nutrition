import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FatsCard from './fats-card';
import Arc from './diagrams/arc';
import SmallCircle from './diagrams/small-circle';
import emptyNutrients from '@/app/test_objects/empty-nutrients.json';
import nutrients from '@/app/test_objects/nutrients1.json';

jest.mock('./diagrams/small-circle');
jest.mock('./diagrams/arc');

describe('fatty acids', () => {

    it('should render empty card', () => {
        const props = {
            content: null
        }
        render(<FatsCard {...props} />)

        const heading = screen.getByRole('heading', {
            name: /fatty acids/i
        });
        const text = screen.getByText(/no information available\./i);
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    })

    it('should render empty card', () => {
        const props = {
            content: emptyNutrients
        }
        render(<FatsCard {...props} />)

        const heading = screen.getByRole('heading', {
            name: /fatty acids/i
        });
        const text = screen.getByText(/no information available\./i);
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    })

    it('should render card when nutirients are zeros', () => {
        const props = {
            content: nutrients
        }
        render(<FatsCard {...props} />)

        expect(Arc).toHaveBeenCalledTimes(5);
        expect(SmallCircle).toHaveBeenCalledTimes(5);
    })

})