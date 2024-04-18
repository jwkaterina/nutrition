import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompositionCard from './composition-card';
import Arc from './diagrams/arc';
import SmallCircle from './diagrams/small-circle';

jest.mock('./diagrams/small-circle');
jest.mock('./diagrams/arc');

describe('composition', () => {

    it('should render empty card', () => {
        const props = {
            protein: null,
            carbs: null,
            fat: null
        }
        render(<CompositionCard {...props} />)

        const heading = screen.getByRole('heading', {
            name: /composition/i
        });
        const text = screen.getByText(/no information available\./i);
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    })

    it('should render card when nutirients are zeros', () => {
        const props = {
            protein: 0,
            carbs: 0,
            fat: 0
        }
        render(<CompositionCard {...props} />)

        expect(Arc).toHaveBeenCalledTimes(4);
        expect(SmallCircle).toHaveBeenCalledTimes(4);
    })

    it('should render card when nutirients are not zeros', () => {
        const props = {
            protein: 20,
            carbs: 30,
            fat: 40
        }
        render(<CompositionCard {...props} />)

        expect(Arc).toHaveBeenCalledTimes(4);
        expect(SmallCircle).toHaveBeenCalledTimes(4);
    })
})