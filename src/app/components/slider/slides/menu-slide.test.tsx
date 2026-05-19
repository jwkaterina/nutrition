import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuSlide from './menu-slide';
import { AuthContext } from '@/app/context/auth-context';
import MenuCard from '../../cards/menu-cards/menu-card';
import menuArray from '@/app/test_objects/menusArray.json';
import useSWR from 'swr';

jest.mock('../../cards/menu-cards/menu-card');
jest.mock('swr');

describe('menu slide', () => {

    const renderWithAuth = (token: string | null) => {
        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <MenuSlide />
            </AuthContext.Provider>
        );
        return container;
    };

    it('should render menu slide whithout token', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        renderWithAuth(null);
        expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
        expect(MenuCard).not.toHaveBeenCalled();
    });

    it('should fetch menus', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        const token = 'token';
        renderWithAuth(token);
        expect(useSWR).toHaveBeenCalledWith(['/menus', token], expect.any(Function));
    });

    it('should render menu slide whith token and menulist', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: menuArray });
        const token = 'token';
        renderWithAuth(token);
        expect(MenuCard).toHaveBeenCalledTimes(menuArray.menus.length);
    });

    it('should render menu slide whith error', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: new Error() });
        const token = 'token';
        renderWithAuth(token);
        expect(MenuCard).not.toHaveBeenCalled();
    });
})
