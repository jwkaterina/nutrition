import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import RecipeForm from './recipe-form';
import { CurrentRecipeContext, CurrentRecipeContextProps } from '@/app/context/recipe-context';
import { CardOpenContext } from '@/app/context/card-context';
import { AnalysisMode, CardState } from '@/app/types/types';
import loadedRecipe from '@/app/test_objects/loaded-recipe.json';

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: '',
        };
    },
}));

jest.mock('../../../components/cards/recipe-cards/recipe-card', () => jest.fn());

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn().mockReturnValue({
      sendRequest: () => loadedRecipe.recipe.nutrients,
    }),
}));

describe('recipe-form', () => {

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
        
        screen.logTestingPlaygroundURL();
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
        
        screen.logTestingPlaygroundURL();
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
        screen.debug();
    });

    it('should sumbit new recipe', async() => {
   
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

        screen.logTestingPlaygroundURL();
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

        const form = screen.queryByRole('form', {
            name: /form/i
        });

        expect(form).not.toBeInTheDocument();
        
    });

});