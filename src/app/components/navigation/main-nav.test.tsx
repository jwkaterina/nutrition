import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MainNav from './main-nav';
import { SlideContext } from '@/app/context/slide-context';
import { SlideType } from "@/app/types/types";

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

describe('main nav', () => {

    const setSlide = jest.fn();
    const setBlockScroll = jest.fn();
    const setScrollBehavior = jest.fn();
    const renderComponentWithSlideContext = (slide: SlideType, blockScroll: boolean, scrollBehavior: 'auto' | 'smooth') => {
        
        const { container } = render(
            <SlideContext.Provider value={{
                slide: slide,
                setSlide: setSlide,
                blockScroll: blockScroll,
                setBlockScroll: setBlockScroll,
                scrollBehavior: scrollBehavior,
                setScrollBehavior: setScrollBehavior
            }}>
                <MainNav />
            </SlideContext.Provider>);

        return container
    }

    it('should render main nav', async() => {

        const nav = renderComponentWithSlideContext(SlideType.FOOD, false, 'smooth');

        const links = nav.querySelectorAll('.link');
        const scroll = nav.querySelector('.scroll_bar');

        const linkWidth = '100px';
        const scrollBarWidth: string = '20vw';
        const spaceWidth: string = `calc((100vw - 3 * ${linkWidth}) / 4)`;
        const position1: string = `calc(${spaceWidth} + ${linkWidth} / 2 - ${scrollBarWidth} / 2)`;   
        const position2: string = `calc(2 * ${spaceWidth} + ${linkWidth} / 2 * 3 - ${scrollBarWidth} / 2)`;

        expect(links).toHaveLength(3);
        expect(scroll).toBeInTheDocument();
        expect((scroll!)).toHaveStyle({left: position1});

        const recipeLink = screen.getByText(/my recipes/i);
        await user.click(recipeLink);
        expect(setBlockScroll).toHaveBeenLastCalledWith(true);
        expect(setSlide).toHaveBeenLastCalledWith(SlideType.RECIPE);
        setTimeout(() => {
            expect(setBlockScroll).toHaveBeenLastCalledWith(false);
            expect((scroll!)).toHaveStyle({left: position2});
        }, 500);

    })

})