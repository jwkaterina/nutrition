import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AuthMenu from './auth-menu';
import { SlideContext } from '@/app/context/slide-context';
import {  useRouter } from 'next/navigation';
import { SlideType } from '@/app/types/types';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('auth menu', () => {

    const push = jest.fn();
    const back = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({push, back});

    type scroll = 'auto' | 'smooth';
    const slideValue = {
        slide: SlideType.FOOD,
        setSlide: jest.fn(),
        blockScroll: false,
        setBlockScroll: jest.fn(),
        scrollBehavior: 'smooth' as scroll,
        setScrollBehavior: jest.fn()
    }


    const renderComponentWithContext = () => {

        const { container } = render(
            <SlideContext.Provider value={slideValue}>
                <AuthMenu />
            </SlideContext.Provider>);
        return container
    } 

    it('should render auth menu', async() => {

        const menu = renderComponentWithContext();

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const homeLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(homeLink).toBeInTheDocument();

        await user.click(backLink);

        expect(slideValue.setScrollBehavior).toHaveBeenCalledWith('auto');
		expect(back).toHaveBeenCalled();
		setTimeout(() => {
            expect(slideValue.setScrollBehavior).toHaveBeenCalledWith('smooth');
		}, 500);

        await user.click(homeLink);
        expect(slideValue.setScrollBehavior).toHaveBeenCalledWith('auto');
		expect(push).toHaveBeenCalledWith('/');
		setTimeout(() => {
            expect(slideValue.setScrollBehavior).toHaveBeenCalledWith('smooth');
		}, 500);    
    });
    
})