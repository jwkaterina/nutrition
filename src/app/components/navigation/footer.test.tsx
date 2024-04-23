import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Footer from './footer';
import { AuthContext } from "@/app/context/auth-context";
import { SlideContext } from "@/app/context/slide-context";
import { CardOpenContext } from "@/app/context/card-context";
import { CardState, SlideType } from "@/app/types/types";
import { usePathname, useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn()
}));

describe('footer', () => {

    const mockedPathname = usePathname as jest.Mock;
    const mockRouter = {
        push: jest.fn()
    };
  
    (useRouter as jest.Mock).mockReturnValue(mockRouter)

    const props = {
        color: 'var(--praimary-color)',
        setFile: jest.fn()
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

    const logout = jest.fn();

    const renderComponentWithContext = (isLoggedIn: boolean) => {

        const authValue = {
            isLoggedIn: isLoggedIn,
            token: '123',
            login: jest.fn(),
            logout: logout
        }
        const { container } = render(
            <SlideContext.Provider value={slideValue}>
                <AuthContext.Provider value={authValue}>
                    <CardOpenContext.Provider value={cardOpenValue}>
                        <Footer { ...props }/>
                    </CardOpenContext.Provider>
                </AuthContext.Provider>
            </SlideContext.Provider>);
        return container
    } 

    it('should render footer when it is home and logged in', async() => {

        mockedPathname.mockReturnValue('/');
        const footer = renderComponentWithContext(true);

        const links = footer.querySelectorAll('.link');
        const homeLink = links[0];
        const logLink = links[1];

        expect(homeLink).toBeInTheDocument();
        expect(logLink).toBeInTheDocument();

        await user.click(homeLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSING);

        await user.click(logLink);
        expect(logout).toHaveBeenCalled();
    })

    it('should render footer when not home and logged out', async() => {

        mockedPathname.mockReturnValue('/analysis');
        const footer = renderComponentWithContext(false);

        const links = footer.querySelectorAll('.link');
        const homeLink = links[0];
        const logLink = links[1];

        expect(homeLink).toBeInTheDocument();
        expect(logLink).toBeInTheDocument();

        await user.click(homeLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);
        expect(mockRouter.push).toHaveBeenCalledWith('/');

        await user.click(logLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/basic_auth'); 
    })

})