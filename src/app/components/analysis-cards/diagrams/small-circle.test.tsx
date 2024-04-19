import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmallCircle from './small-circle';

describe('closed card', () => {

    it('should render card', () => {
        const props = {
            percent: 30.456, 
            color: 'var(--gray-light)', 
            text: 'Water',
            heightWidth: 20
        };

        render(<SmallCircle {... props} />);

        const percent = screen.getByText(/30%/i);

        expect(percent).toBeInTheDocument();
    })
})