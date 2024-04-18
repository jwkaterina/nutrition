import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyValueCard from './dailyvalue-card';
import nutrients from '@/app/test_objects/nutrients1.json';
import HalfCircle from './diagrams/half-circle';

jest.mock('./diagrams/half-circle');

describe('daily values', () => {

    it('should render card with half circles', () => {
        const props = {
            content: nutrients
        }
        render(<DailyValueCard {...props} />)

        expect(HalfCircle).toHaveBeenCalledTimes(4);
    })
})