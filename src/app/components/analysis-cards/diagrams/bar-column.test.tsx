import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarColumn from './bar-column';

describe('bar column', () => {

    it('should render empty div', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const props = {
            nutrient: undefined,
            nutrientPercent: undefined,
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<BarColumn {...props} />)

        const barColumn = container.querySelector('.bar_column');
        expect(barColumn).not.toBeInTheDocument();
    });

    it('should animate bar column when percent is less than 100', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            nutrientPercent: {
                "label": "Sodium",
                "quantity": 0.2,
                "unit": "%"
            },
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<BarColumn {...props} />)

        const barColumn = container.querySelector('.bar_column');
        expect(barColumn).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        const keyframes: Keyframe[] = [
            { height: 0 },
            { height: `0.2px` }
        ];
        const mockedAnimation = HTMLDivElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate bar column when percent is more than 100', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            nutrientPercent: {
                "label": "Sodium",
                "quantity": 104,
                "unit": "%"
            },
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<BarColumn {...props} />)

        const barColumn = container.querySelector('.bar_column');
        expect(barColumn).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        const keyframes: Keyframe[] = [
            { height: 0 },
            { height: `100px` }
        ];
        const mockedAnimation = HTMLDivElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

})