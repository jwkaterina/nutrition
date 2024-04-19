import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Arc from './arc';

describe('arc', () => {

    it('should animate arc', () => {
        
        SVGElement.prototype.animate = jest.fn();
        const props = {
            degree: 30,
            percent: 20,
            color: 'var(--gray-light)',
            radius: 5,
            strokeWidth: 3
        }
        
        render(<Arc {...props} />)

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: 10 * Math.PI },
            { strokeDashoffset: 8 * Math.PI }
        ];

        const mockedAnimation = SVGElement.prototype.animate;
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, options);
    });

})