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
import RecipeCard from '@/app/components/cards/recipe-cards/recipe-card'

jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}));

jest.mock('../../../components/cards/recipe-cards/recipe-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

jest.mock('../../../hooks/recipe-hook', () => ({
    useRecipeFetch: jest.fn().mockReturnValue({
        fetchRecipeNutrients: () => loadedRecipe.recipe.nutrients,
    }),
}));

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
        
        const name = screen.getByRole('textbox', {
            name: /recipe name/i
        });
        const addImageButton = screen.getByRole('button', {
            name: /add image/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const number = screen.getByRole('spinbutton', {
            name: /number of servings/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });
        const deleteButton = screen.queryByRole('button', {
            name: /delete/i
        });
        expect(name).toBeInTheDocument();
        expect(ingredients).toBeInTheDocument();
        expect(number).toBeInTheDocument();
        expect(addImageButton).toBeInTheDocument();
        expect(analyseButton).toBeInTheDocument();
        expect(deleteButton).not.toBeInTheDocument();
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
        
        const name = screen.getByRole('textbox', {
            name: /recipe name/i
        });
        const changeImageButton = screen.getByRole('button', {
            name: /change image/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const number = screen.getByRole('spinbutton', {
            name: /number of servings/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });
        const deleteButton = screen.queryByRole('button', {
            name: /delete/i
        });
        expect(name).toHaveValue(loadedRecipe.recipe.name);
        expect(ingredients).toHaveTextContent(loadedRecipe.recipe.ingredients.join('\n'));
        expect(number).toHaveValue(loadedRecipe.recipe.servings);
        expect(changeImageButton).toBeInTheDocument();
        expect(analyseButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    it('should sumbit new recipe', async() => {
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

        const name = screen.getByRole('textbox', {
            name: /recipe name/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const number = screen.getByRole('spinbutton', {
            name: /number of servings/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });

        await user.type(name, loadedRecipe.recipe.name);
        await user.type(ingredients, loadedRecipe.recipe.ingredients.toString());
        await user.clear(number);
        await user.type(number, '1');
        await user.click(analyseButton);

        expect(contextValue.setCurrentRecipe).toHaveBeenCalledWith({
            recipe: loadedRecipe.recipe,
            id: null,
            image: null,
            mode: AnalysisMode.VIEW
        });
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        await user.click(deleteButton);

        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();
    });

    it('should delete recipe when request is sent successfulle', async() => {
   
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        await user.click(deleteButton);
        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();

        await user.click(deleteButton);
        expect(contextValue.setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
    });

    it('should not delete recipe when request returns an error', async() => {
   
        mockeduseHttpClient.mockReturnValue({sendRequest: async() => {
            throw new Error
        }});
        
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        await user.click(deleteButton);
        expect(contextValue.setCurrentRecipe).not.toHaveBeenCalled();

        await user.click(deleteButton);
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
        })
    });

    it('should render recipe card instead of form', () => {

        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const props = {
            searchCleared: false, 
            setClearSearch: jest.fn(), 
            setFile: jest.fn()
        };
        
        const { container } = render(
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

        const form = screen.queryByRole('form', {
            name: /form/i
        });
        // const cardContainer = container.querySelector('.card_container');

        expect(form).not.toBeInTheDocument();
        // expect(cardContainer).toBeInTheDocument();
        expect(RecipeCard).toHaveBeenCalled();
        
    });

});