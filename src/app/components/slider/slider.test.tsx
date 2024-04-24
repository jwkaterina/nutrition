import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Slider from './slider';
import { SlideContext } from "@/app/context/slide-context";
import { CardOpenContext } from "@/app/context/card-context";
import { CardState, SlideType } from "@/app/types/types";
import FoodSlide from './slides/food-slide';
import RecipeSlide from './slides/recipe-slide';
import MenuSlide from './slides/menu-slide';

jest.mock('./slides/food-slide');
jest.mock('./slides/recipe-slide');
jest.mock('./slides/menu-slide');
jest.spyOn(window, 'scrollTo').mockImplementationOnce(() => {
    console.log('Scrolled to:', 0, 0);
});

const mockWindowScroll = scrollTo as jest.Mock;

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: 500,
});

HTMLElement.prototype.scrollTo = jest.fn();
const mockElementScroll = HTMLElement.prototype.scrollTo;
describe('slider', () => {

    const props = {
        foodDeleted: false
    }

    type scrollType = 'auto' | 'smooth';
    const slideValue = {
        slide: SlideType.FOOD,
        setSlide: jest.fn(),
        blockScroll: false,
        setBlockScroll: jest.fn(),
        scrollBehavior: 'auto' as scrollType,
        setScrollBehavior: jest.fn()
    };

    const cardOpenValue = {
        cardOpen: CardState.OPEN,
        setCardOpen: jest.fn()
    }


    const renderComponentWithContext = () => {

        const { container } = render(
            <SlideContext.Provider value={slideValue}>
                <CardOpenContext.Provider value={cardOpenValue}>
                    <Slider { ...props }/>
                </CardOpenContext.Provider>
            </SlideContext.Provider>);
        return container
    } 

    it('should render slider when open', async() => {

        const container = renderComponentWithContext();

        const slider = container.querySelector('.container');
        expect(slider).toHaveStyle({overflow: 'hidden'});
        expect(FoodSlide).toHaveBeenCalledWith({foodDeleted: false}, {});
        expect(RecipeSlide).toHaveBeenCalled();
        expect(MenuSlide).toHaveBeenCalled();
        expect(mockWindowScroll).toHaveBeenCalledWith(0, 0);
        expect(mockElementScroll).toHaveBeenCalledWith({
            top: 0,
            left: slider!.clientWidth * slideValue.slide,
            behavior: slideValue.scrollBehavior
        });

        fireEvent.scroll(slider!, { target: { scrollLeft: 500 } });
        expect(slideValue.setSlide).toHaveBeenCalledWith(SlideType.RECIPE);

    })

})