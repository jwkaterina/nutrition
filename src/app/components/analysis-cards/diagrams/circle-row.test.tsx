import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CircleRow from './circle-row';

describe('circle row', () => {

    it('should render empty div', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: undefined,
            nutrientPercent: undefined,
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<CircleRow {...props} />)

        const circleRow = container.querySelector('.circle_row');
        expect(circleRow).not.toBeInTheDocument();
    });

    it('should animate circle row when percent is 0', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            nutrientPercent: {
                "label": "Sodium",
                "quantity": 0,
                "unit": "%"
            },
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<CircleRow {...props} />)

        const circleRow = container.querySelector('.circle_row');
        expect(circleRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 30 * Math.PI },
            { strokeDashoffset: 30 * Math.PI }
        ];
        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate circle row when percent is less than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            nutrientPercent: {
                "label": "Sodium",
                "quantity": 60,
                "unit": "%"
            },
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<CircleRow {...props} />)

        const circleRow = container.querySelector('.circle_row');
        expect(circleRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 30 * Math.PI },
            { strokeDashoffset: 12 * Math.PI }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate circle row when percent is more than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Sodium, Na",
                "quantity": 5.7,
                "unit": "mg"
            },
            nutrientPercent: {
                "label": "Sodium",
                "quantity": 120,
                "unit": "%"
            },
            label: 'sodium',
            color: 'var(--primary-color)',
            lightColor: 'var(--primary-light-color)'
        }
        
        const { container } = render(<CircleRow {...props} />)

        const circleRow = container.querySelector('.circle_row');
        expect(circleRow).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 30 * Math.PI },
            { strokeDashoffset: 0 }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

})