import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HalfCircle from './half-circle';

describe('half circle', () => {

    it('should render empty div', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: undefined,
            daily: undefined,
            text: 'Protein',
            color: 'var(--primary-color)',
            lighterColor: 'var(--primary-light-color)',
            radius: 30,
            strokeWidth: 4,
            centerX: 32,
            centerY: 18
        }
        
        const { container } = render(<HalfCircle {...props} />)

        const halfCircle = container.querySelector('.daily_container');
        expect(halfCircle).not.toBeInTheDocument();
    });

    it('should animate half circle when percent is 0', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Protein",
                "quantity": 26.2522,
                "unit": "g"
            },
            daily: {
                "label": "Protein",
                "quantity": 0,
                "unit": "%"
            },
            text: 'Protein',
            color: 'var(--primary-color)',
            lighterColor: 'var(--primary-light-color)',
            radius: 30,
            strokeWidth: 4,
            centerX: 32,
            centerY: 18
        }
        
        const { container } = render(<HalfCircle {...props} />)

        screen.logTestingPlaygroundURL();
        const halfCircle = container.querySelector('.daily_container');
        expect(halfCircle).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 60 * Math.PI },
            { strokeDashoffset: 60 * Math.PI }
        ];
        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate half circle when percent is less than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Protein",
                "quantity": 26.2522,
                "unit": "g"
            },
            daily: {
                "label": "Protein",
                "quantity": 40,
                "unit": "%"
            },
            text: 'Protein',
            color: 'var(--primary-color)',
            lighterColor: 'var(--primary-light-color)',
            radius: 30,
            strokeWidth: 4,
            centerX: 32,
            centerY: 18
        }
        
        const { container } = render(<HalfCircle {...props} />)

        const halfCircle = container.querySelector('.daily_container');
        expect(halfCircle).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 60 * Math.PI },
            { strokeDashoffset: 48 * Math.PI }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

    it('should animate half circle when percent is more than 100', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            nutrient: {
                "label": "Protein",
                "quantity": 26.2522,
                "unit": "g"
            },
            daily: {
                "label": "Protein",
                "quantity": 110,
                "unit": "%"
            },
            text: 'Protein',
            color: 'var(--primary-color)',
            lighterColor: 'var(--primary-light-color)',
            radius: 30,
            strokeWidth: 4,
            centerX: 32,
            centerY: 18
        }
        
        const { container } = render(<HalfCircle {...props} />)

        const halfCircle = container.querySelector('.daily_container');
        expect(halfCircle).toBeInTheDocument();

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 60 * Math.PI },
            { strokeDashoffset: 30 * Math.PI }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

})