import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeSlide from './recipe-slide';
import { AuthContext } from '@/app/context/auth-context';
import RecipeCard from '../../cards/recipe-cards/recipe-card';
import recipe from '@/app/test_objects/loaded-recipe.json';
import useSWR from 'swr';

jest.mock('../../cards/recipe-cards/recipe-card');
jest.mock('swr');

describe('recipe slide', () => {

    const renderWithAuth = (token: string | null) => {
        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <RecipeSlide />
            </AuthContext.Provider>
        );
        return container;
    };

    it('should render recipe slide whithout token', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        renderWithAuth(null);
        expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
        expect(RecipeCard).not.toHaveBeenCalled();
    });

    it('should render recipe slide whith token', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        const token = 'token';
        renderWithAuth(token);
        expect(useSWR).toHaveBeenCalledWith(['/recipes', token], expect.any(Function));
    });

    it('should render recipe slide whith token and recipelist', () => {
        const recipesArray = { recipe: [recipe] };
        (useSWR as jest.Mock).mockReturnValue({ data: recipesArray });
        const token = 'token';
        renderWithAuth(token);
        expect(RecipeCard).toHaveBeenCalledTimes(recipesArray.recipe.length);
    });

    it('should render food slide whith error', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: new Error() });
        const token = 'token';
        renderWithAuth(token);
        expect(RecipeCard).not.toHaveBeenCalled();
    });
})
