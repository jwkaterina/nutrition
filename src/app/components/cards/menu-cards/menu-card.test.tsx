import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MenuCard from './menu-card';
import menu from '@/app/test_objects/menu1.json';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { CardOpenContext } from '@/app/context/card-context';
import OpenMenuCard from './open-menucard';
import { AnalysisMode, CardState } from '@/app/types/types';

jest.mock('./open-menucard');

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

describe('menu card', () => {

    HTMLElement.prototype.animate = jest.fn();

    it('should render menu card', () => {

        const props = {
            menu: menu.menu,
            index: 5,
            id: null,
            open: false
        };

        const { container } = render(<MenuCard {... props} />);
        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenMenuCard).not.toHaveBeenCalled();
    })

    it('should render open menu card when is open and do not handle click', async() => {

        const props = {
            menu: menu.menu,
            index: 5,
            id: null,
            open: true
        };

        const setCurrentMenu = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.OPEN,
                setCardOpen: setCardOpen
            }}>
                  <CurrentMenuContext.Provider value={{
                        currentMenu: {
                            menu: null,
                            id: null,
                            mode: AnalysisMode.VIEW
                        },
                        setCurrentMenu: setCurrentMenu
                    }}>
                    <MenuCard {... props} />
                </CurrentMenuContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenMenuCard).toHaveBeenCalledWith({menu: props.menu}, {});

        await user.click(card!);
        expect(setCurrentMenu).not.toHaveBeenCalled();
        expect(setCardOpen).not.toHaveBeenCalled();
    })

    it('should open card on click', async() => {

        const props = {
            menu: menu.menu,
            index: 5,
            id: null,
            open: false
        };

        const setCurrentMenu = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.OPEN,
                setCardOpen: setCardOpen
            }}>
                  <CurrentMenuContext.Provider value={{
                        currentMenu: {
                            menu: null,
                            id: null,
                            mode: AnalysisMode.VIEW
                        },
                        setCurrentMenu: setCurrentMenu
                    }}>
                    <MenuCard {... props} />
                </CurrentMenuContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenMenuCard).not.toHaveBeenCalled();

        await user.click(card!);
        screen.logTestingPlaygroundURL();

        expect(setCurrentMenu).toHaveBeenCalledWith({menu: props.menu, id: props.id, mode: AnalysisMode.VIEW});
        expect(setCardOpen).toHaveBeenCalledWith(CardState.OPENING)
        expect(OpenMenuCard).toHaveBeenCalledWith({menu: props.menu}, {});

    })
})