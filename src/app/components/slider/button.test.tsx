import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from "./button";

describe('button', () => {

    it('should render button', async() => {

        const props = {search: 'analysis/food-analysis'};
        render(<Button {...props} />);

        expect(screen.getByRole('link')).toHaveAttribute('href', '/analysis/food-analysis')

    })
})