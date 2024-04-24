import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeSlide from './recipe-slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import RecipeCard from '../../cards/recipe-cards/recipe-card';
import recipe from '@/app/test_objects/loaded-recipe.json';

jest.mock('../../cards/recipe-cards/recipe-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('recipe slide', () => {

    const renderWithAuth = (token: string | null) => {

        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token: token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <RecipeSlide />
            </AuthContext.Provider>
        );

            return container;

    }
       
    it('should render recipe slide whithout token', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        renderWithAuth(null);

        expect(RecipeCard).not.toHaveBeenCalled();
        expect(sendRequest).not.toHaveBeenCalled();
    })
       
    it('should render recipe slide whith token', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        const token = 'token';
        renderWithAuth(token);

        expect(sendRequest).toHaveBeenCalledWith(
            `/recipes`, 'GET', null, {
                Authorization: 'Bearer ' + token
            }, true, false
        );

    })
       
    it('should render recipe slide whith token and recipelist', async() => {

        const recipesArray = {recipe: [recipe]};
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: () => {return recipesArray}
        });
        const token = 'token';
        const slideContainer = renderWithAuth(token);
        const slide = slideContainer.querySelector('.slide');

        await waitFor(() => expect(slide).toBeInTheDocument());
        screen.logTestingPlaygroundURL();
        expect(RecipeCard).toHaveBeenCalledTimes(recipesArray.recipe.length);

    })
       
    it('should render food slide whith error', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: () => { throw new Error()}
        });
        const token = 'token';
        renderWithAuth(token);

        expect(RecipeCard).not.toHaveBeenCalled();

    })

})