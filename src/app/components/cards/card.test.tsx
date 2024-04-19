import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './card';
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from "@/app/types/types";

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

describe('card', () => {

    const setIsOpen = jest.fn();
    const setCardOpen = jest.fn();
    const renderComponentWithCardOpenContext = (index: number, isOpen: boolean, cardOpen: CardState) => {

        const props = {
            index: index,
            children: <></>,
            onCardClick: jest.fn(),
            setIsOpen: setIsOpen,
            isOpen: isOpen
        }
        
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: cardOpen,
                setCardOpen: setCardOpen
            }}>
                <Card {...props} />
            </CardOpenContext.Provider>);

        return container
    }

    it('should not animate when is not open', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, false, CardState.OPENING);
        const card = container.querySelector('.card');

        expect(card).toHaveStyle({cursor: 'pointer'});
        expect(mockedAnimation).not.toHaveBeenCalled();
    });

    it('should not animate when is open and cardState is Open', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, true, CardState.OPEN);

        const card = container.querySelector('.card');
        
        expect(card).toHaveStyle({
            height: '100%',
            width: '100vw'
        });
        expect(mockedAnimation).not.toHaveBeenCalled();
    });

    it('should animate when is open and cardState is Opening', async() => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const index = 5;
        const duration = 300;
        renderComponentWithCardOpenContext(index, true, CardState.OPENING);

        const keyframes: Keyframe[] = [
            {top: 0, left: 0, width: "100%", height: "150px", zIndex: 1},
            {top: "-5rem", left: "-1rem", width: "100vw", height: "calc(100vh - 2 * 60px)", zIndex: 2, transform: "translate(0px, -600px)"}
        ];
        const animationOptions: KeyframeAnimationOptions  = {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        expect(mockedAnimation).toHaveBeenCalledWith(keyframes, animationOptions);
        setTimeout(() => {
            expect(setCardOpen).toHaveBeenCalledWith(CardState.OPEN);
        }, duration);
    });
    it('should animate when is open and cardState is Closing', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const index = 5;
        const duration = 300;

        renderComponentWithCardOpenContext(index, true, CardState.CLOSING);

        const keyframesReverse: Keyframe[] = [
            {top: "-1rem", left: "-1rem", width: "100vw", height: "calc(100vh - 2 * 60px)",zIndex: 2},
            {top: 0, left: 0, width: "100%", height: "150px", zIndex: 1, transform: "translate(0px, 0px)"}
        ];
        const animationOptions: KeyframeAnimationOptions  = {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        expect(mockedAnimation).toHaveBeenCalledWith(keyframesReverse, animationOptions);
        expect(setIsOpen).toHaveBeenCalledWith(false);
        setTimeout(() => {
            expect(setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);
        }, duration);
    });

    it('should animate when is open and cardState is Closed', () => {
        
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const index = 5;

        renderComponentWithCardOpenContext(index, true, CardState.CLOSED);

        const keyframesReverse: Keyframe[] = [
            {top: "-1rem", left: "-1rem", width: "100vw", height: "calc(100vh - 2 * 60px)",zIndex: 2},
            {top: 0, left: 0, width: "100%", height: "150px", zIndex: 1, transform: "translate(0px, 0px)"}
        ];
        const styleOptions: KeyframeAnimationOptions  = {
            duration: 0,
            fill: 'forwards'
        };

        expect(mockedAnimation).toHaveBeenCalledWith(keyframesReverse, styleOptions);
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });
})