import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarRow from './bar-row';

describe('bar row', () => {

    it('should render empty div', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: undefined,
            daily: undefined,
            title: 'sodium',
            color: 'var(--primary-color)'
        }
        
        const { container } = render(<BarRow {...props} />)

        const barRow = container.querySelector('.bar_row');
        expect(barRow).not.toBeInTheDocument();
    });

    it('should animate bar row when percent is 0', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            daily: {
                "label": "Sodium",
                "quantity": 0,
                "unit": "%"
            },
            title: 'sodium',
            color: 'var(--primary-color)'
        }
        
        const { container } = render(<BarRow {...props} />)

        const barRow = container.querySelector('.bar_row');
        expect(barRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 70 },
            { strokeDashoffset: 70 }
        ];
        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate bar row when percent is less than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            daily: {
                "label": "Sodium",
                "quantity": 80,
                "unit": "%"
            },
            title: 'sodium',
            color: 'var(--primary-color)'
        }
        
        const { container } = render(<BarRow {...props} />)

        const barRow = container.querySelector('.bar_row');
        expect(barRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 70 },
            { strokeDashoffset: 70 - (80 / 100 * 70) }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate bar row when percent is more than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            daily: {
                "label": "Sodium",
                "quantity": 105,
                "unit": "%"
            },
            title: 'sodium',
            color: 'var(--primary-color)'
        }
        
        const { container } = render(<BarRow {...props} />)

        const barRow = container.querySelector('.bar_row');
        expect(barRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 70 },
            { strokeDashoffset: 0 }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

})