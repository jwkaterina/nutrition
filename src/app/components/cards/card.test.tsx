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

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

    it('should not set styles when is not open', () => {

        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, false, CardState.OPENING);
        const card = container.querySelector('.card') as HTMLElement;

        expect(card.style.position).toBe('');
        expect(mockedAnimation).not.toHaveBeenCalled();
    });

    it('should have expanded styles when is open and cardState is Open', () => {

        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, true, CardState.OPEN);
        const card = container.querySelector('.card') as HTMLElement;

        expect(card.style.position).toBe('fixed');
        expect(card.style.width).toBe('100vw');
        expect(mockedAnimation).not.toHaveBeenCalled();
    });

    it('should not set styles when is open and cardState is Opening without prior click', () => {

        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, true, CardState.OPENING);
        const card = container.querySelector('.card') as HTMLElement;

        // rectRef is null (no click happened before), so the opening effect returns early
        expect(card.style.position).toBe('');
        expect(mockedAnimation).not.toHaveBeenCalled();
    });

    it('should call setIsOpen after animation completes when closing', () => {

        jest.useFakeTimers();
        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        renderComponentWithCardOpenContext(5, true, CardState.CLOSING);

        expect(setIsOpen).not.toHaveBeenCalled();
        expect(mockedAnimation).not.toHaveBeenCalled();

        jest.advanceTimersByTime(380);
        expect(setIsOpen).toHaveBeenCalledWith(false);

        jest.useRealTimers();
    });

    it('should call setIsOpen and clear styles when cardState is Closed', () => {

        HTMLDivElement.prototype.animate = jest.fn();
        const mockedAnimation = HTMLDivElement.prototype.animate;

        const container = renderComponentWithCardOpenContext(5, true, CardState.CLOSED);
        const card = container.querySelector('.card') as HTMLElement;

        expect(card.style.cssText).toBe('');
        expect(setIsOpen).toHaveBeenCalledWith(false);
        expect(mockedAnimation).not.toHaveBeenCalled();
    });
})
