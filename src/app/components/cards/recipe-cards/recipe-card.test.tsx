import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RecipeCard from './recipe-card';
import recipe from '@/app/test_objects/loaded-recipe.json';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CardOpenContext } from '@/app/context/card-context';
import OpenRecipeCard from './open-recipecard';
import { AnalysisMode, CardState } from '@/app/types/types';

jest.mock('./open-recipecard');

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 500px)'
    })),
});

describe('recipe card', () => {

    HTMLElement.prototype.animate = jest.fn();

    it('should render recipe card', () => {

        const props = {
            recipe: recipe.recipe,
            index: 5,
            id: null,
            open: false,
            image: recipe.image
        };

        const { container } = render(<RecipeCard {... props} />);
        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenRecipeCard).not.toHaveBeenCalled();
    })

    it('should render open recipe card when is open and do not handle click', async() => {

        const props = {
            recipe: recipe.recipe,
            index: 5,
            id: recipe.id,
            open: true,
            image: recipe.image
        };

        const setCurrentRecipe = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.OPEN,
                setCardOpen: setCardOpen
            }}>
                  <CurrentRecipeContext.Provider value={{
                        currentRecipe: {
                            recipe: null,
                            id: null,
                            image: null,
                            mode: AnalysisMode.VIEW
                        },
                        setCurrentRecipe: setCurrentRecipe
                    }}>
                    <RecipeCard {... props} />
                </CurrentRecipeContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenRecipeCard).toHaveBeenCalledWith({recipe: props.recipe, image: props.image}, {});

        await user.click(card!);
        expect(setCurrentRecipe).not.toHaveBeenCalled();
        expect(setCardOpen).not.toHaveBeenCalled();
    })

    it('should open card on click', async() => {

        const props = {
            recipe: recipe.recipe,
            index: 5,
            id: recipe.id,
            open: false,
            image: recipe.image
        };

        const setCurrentRecipe = jest.fn();
        const setCardOpen = jest.fn();
        const { container } = render(
            <CardOpenContext.Provider value={{
                cardOpen: CardState.OPEN,
                setCardOpen: setCardOpen
            }}>
                  <CurrentRecipeContext.Provider value={{
                        currentRecipe: {
                            recipe: null,
                            id: null,
                            image: null,
                            mode: AnalysisMode.VIEW
                        },
                        setCurrentRecipe: setCurrentRecipe
                    }}>
                    <RecipeCard {... props} />
                </CurrentRecipeContext.Provider>
            </CardOpenContext.Provider>
        );

        const card = container.querySelector('.card');
        expect(card).toBeInTheDocument();
        expect(OpenRecipeCard).not.toHaveBeenCalled();

        await user.click(card!);
        screen.logTestingPlaygroundURL();

        expect(setCurrentRecipe).toHaveBeenCalledWith({recipe: props.recipe, id: props.id, image: props.image, mode: AnalysisMode.VIEW});
        expect(setCardOpen).toHaveBeenCalledWith(CardState.OPENING)
        expect(OpenRecipeCard).toHaveBeenCalledWith({recipe: props.recipe, image: props.image}, {});

    })
})