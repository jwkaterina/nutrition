import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuSlide from './menu-slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import MenuCard from '../../cards/menu-cards/menu-card';
import menuArray from '@/app/test_objects/menusArray.json';
import recipe from '@/app/test_objects/loaded-recipe.json';
import nutrients from '@/app/test_objects/nutrients1.json';

jest.mock('../../cards/menu-cards/menu-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

jest.mock('../../../hooks/menu-hook', () => ({
    useMenuFetch: jest.fn().mockReturnValue({
        fetchMenuNutrients: () => nutrients
    }),
}));

describe('menu slide', () => {

    const renderWithAuth = (token: string | null) => {

        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token: token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <MenuSlide />
            </AuthContext.Provider>
        );

            return container;

    }
       
    it('should render menu slide whithout token', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        renderWithAuth(null);

        expect(MenuCard).not.toHaveBeenCalled();
        expect(sendRequest).not.toHaveBeenCalled();
    })
       
    it('should fetch menus', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        const token = 'token';
        renderWithAuth(token);

        expect(sendRequest).toHaveBeenCalledWith(
            `/menus`,'GET', null, {
                Authorization: 'Bearer ' + token
            }, true, false
        );
    })
       
    it('should render menu slide whith token and menulist', async() => {

        const mockeduseHttpClient = useHttpClient as jest.Mock;
        mockeduseHttpClient.mockImplementation(() => ({
            sendRequest: (url: string, ...args: any) => {
                if (url.startsWith('/menus')) {
                    return menuArray;
                } else if (url.startsWith('/recipes')) {
                    return {recipe: recipe};
                }
            }
        }));
        const token = 'token';
        const slideContainer = renderWithAuth(token);
        const slide = slideContainer.querySelector('.slide');

        await waitFor(() => {
            expect(slide).toBeInTheDocument();
            expect(MenuCard).toHaveBeenCalledTimes(menuArray.menus.length);
        });

    })
       
    it('should render menu slide whith error', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: () => { throw new Error()}
        });
        const token = 'token';
        renderWithAuth(token);

        expect(MenuCard).not.toHaveBeenCalled();

    })

})