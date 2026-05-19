import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import RecipeForm from './recipe-form';
import { CurrentRecipeContext, CurrentRecipeContextProps } from '@/app/context/recipe-context';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { AnalysisMode, CardState } from '@/app/types/types';
import loadedRecipe from '@/app/test_objects/loaded-recipe.json';
import { useHttpClient } from '@/app/hooks/http-hook';
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
        replace: jest.fn()
    })
}));

jest.mock('../../../components/cards/recipe-cards/recipe-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

jest.mock('./ingredient-search', () => {
    return function MockIngredientSearch() {
        return <input type="text" aria-label="Ingredients" readOnly />;
    };
});

describe('recipe-form', () => {
    const mockeduseHttpClient = useHttpClient as jest.Mock;

    const renderComponentWithCurrentRecipeContext = (searchCleared: boolean, contextValue: CurrentRecipeContextProps) => {

        const props = {
            searchCleared: searchCleared,
            setClearSearch: jest.fn(),
            setFile: jest.fn()
        }

        render(
            <CurrentRecipeContext.Provider value={contextValue}>
                <RecipeForm {...props} />
            </CurrentRecipeContext.Provider>);
    }

    it('should render recipe-form in view mode', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const contextValue = {
            currentRecipe: {
                recipe: null,
                id: null,
                image: null,
                mode: AnalysisMode.VIEW
            },
            setCurrentRecipe: jest.fn()
        }
        renderComponentWithCurrentRecipeContext(false, contextValue);

        expect(screen.getByRole('textbox', { name: /recipe name/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add image/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /ingredients/i })).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /number of servings/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should render recipe-form in edit mode', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }
        renderComponentWithCurrentRecipeContext(false, contextValue);

        expect(screen.getByRole('textbox', { name: /recipe name/i })).toHaveValue(loadedRecipe.recipe.name);
        expect(screen.getByRole('spinbutton', { name: /number of servings/i })).toHaveValue(loadedRecipe.recipe.servings);
        expect(screen.getByRole('button', { name: /change image/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should submit recipe in edit mode using stored nutrients when no ingredients added', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }
        renderComponentWithCurrentRecipeContext(false, contextValue);

        await user.click(screen.getByRole('button', { name: /analyze/i }));

        expect(contextValue.setCurrentRecipe).toHaveBeenCalledWith(expect.objectContaining({
            recipe: expect.objectContaining({
                name: loadedRecipe.recipe.name,
                nutrients: loadedRecipe.recipe.nutrients
            }),
            id: loadedRecipe.id,
            mode: AnalysisMode.EDIT
        }));
    });

    it('should not delete recipe if not logged in', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn(),
            setFile: jest.fn()
        };

        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }
        render(
            <CurrentRecipeContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: false,
                    token: null,
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <RecipeForm {...props} />
                </AuthContext.Provider>
            </CurrentRecipeContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));

        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();
    });

    it('should delete recipe when request is sent successfully', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn().mockResolvedValueOnce});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn(),
            setFile: jest.fn()
        };

        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }
        render(
            <CurrentRecipeContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: true,
                    token: '123',
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <RecipeForm {...props} />
                </AuthContext.Provider>
            </CurrentRecipeContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
    });

    it('should not delete recipe when request returns an error', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: async() => { throw new Error(); }});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn(),
            setFile: jest.fn()
        };

        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }
        render(
            <CurrentRecipeContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: true,
                    token: '123',
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <RecipeForm {...props} />
                </AuthContext.Provider>
            </CurrentRecipeContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();
    });

    it('should reset recipe', () => {
        const contextValue = {
            currentRecipe: {
                recipe: loadedRecipe.recipe,
                id: loadedRecipe.id,
                image: loadedRecipe.image,
                mode: AnalysisMode.EDIT
            },
            setCurrentRecipe: jest.fn()
        }

        renderComponentWithCurrentRecipeContext(true, contextValue);

        expect(contextValue.setCurrentRecipe).toHaveBeenCalledWith({
            recipe: null,
            id: null,
            image: null,
            mode: AnalysisMode.VIEW
        });
    });

    it('should render recipe card instead of form', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn(),
            setFile: jest.fn()
        };

        render(
            <CurrentRecipeContext.Provider value={{
                currentRecipe: {
                    recipe: loadedRecipe.recipe,
                    id: loadedRecipe.id,
                    image: loadedRecipe.image,
                    mode: AnalysisMode.VIEW
                },
                setCurrentRecipe: jest.fn()
            }}>
                <CardOpenContext.Provider value={{
                    cardOpen: CardState.OPEN,
                    setCardOpen: jest.fn()
                }}>
                    <RecipeForm {...props} />
                </CardOpenContext.Provider>
            </CurrentRecipeContext.Provider>
        );

        expect(screen.queryByRole('form', { name: /form/i })).not.toBeInTheDocument();
        expect(RecipeCard).toHaveBeenCalled();
    });
});
