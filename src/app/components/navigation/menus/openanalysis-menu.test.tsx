import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OpenAnalysisMenu from './openanalysis-menu';
import {  useRouter } from 'next/navigation';
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context";
import { CardOpenContext } from "@/app/context/card-context";
import { CurrentFoodContext } from '@/app/context/food-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { StatusContext } from "@/app/context/status-context";
import { CardState, AnalysisMode, FoodType, StatusType, CurrentFood, CurrentRecipe, CurrentMenu } from '@/app/types/types';
import foodJSON from '@/app/test_objects/food1.json';
import recipeJSON from '@/app/test_objects/loaded-recipe.json';
import menuJSON from '@/app/test_objects/menu1.json';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('openanalysis menu', () => {

    const sendRequest = jest.fn();

    (useHttpClient as jest.Mock).mockReturnValue({sendRequest});

    const push = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({push});

    const props = { 
        file: new Blob(),
        setFile: jest.fn()
    };

    const cardOpenValue = {
        cardOpen: CardState.OPEN,
        setCardOpen: jest.fn()
    }

    const statusValue = {
        isLoading: false,
        setIsLoading: jest.fn(),
        status: StatusType.SUCCESS,
        setStatus: jest.fn(),
        message: null,
        setMessage: jest.fn(),
    }

    const setCurrentFood = jest.fn();
    const setCurrentRecipe = jest.fn();
    const setCurrentMenu = jest.fn();

    const renderComponentWithContext = (food: CurrentFood, recipe: CurrentRecipe, menu: CurrentMenu, token: string | null) => {

        const authValue = {
            isLoggedIn: token ? true : false,
            token: token,
            login: jest.fn(),
            logout: jest.fn()
        }

        const foodValue = {
            currentFood: food,
            setCurrentFood: setCurrentFood
        };


        const recipeValue = {
            currentRecipe: recipe,
            setCurrentRecipe: setCurrentRecipe
        };

        const menuValue = {
            currentMenu: menu,
            setCurrentMenu: setCurrentMenu
        }

        const { container } = render(
            <AuthContext.Provider value={authValue}>
                <CardOpenContext.Provider value={cardOpenValue}>
                    <CurrentFoodContext.Provider value={foodValue}>
                        <CurrentRecipeContext.Provider value={recipeValue}>
                            <CurrentMenuContext.Provider value={menuValue}>
                                <StatusContext.Provider value={statusValue}>
                                    <OpenAnalysisMenu { ...props} />
                                </StatusContext.Provider>
                            </CurrentMenuContext.Provider>
                        </CurrentRecipeContext.Provider>
                    </CurrentFoodContext.Provider>
                </CardOpenContext.Provider>
            </AuthContext.Provider>
        );

        return container
    } 

    it('should render openanalysis menu with food and token', async() => {

        const token = 'token';

        const currentFood: CurrentFood = {
            food: {
                food: {
                    nutrients: foodJSON.food.nutrients,
                    category: FoodType.GENERIC_FOODS,
                    categoryLabel: "food",
                    foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd",
                    image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg",
                    knownAs: "apple",
                    label: "Apple"
                },
                measures: foodJSON.measures
            },
            id: foodJSON.food.foodId
        };

        const currentRecipe: CurrentRecipe = {
            id: null, 
            recipe: null, 
            image: null, 
            mode: AnalysisMode.VIEW
        };

        const currentMenu: CurrentMenu = {
            id: null, 
            menu: null, 
            mode: AnalysisMode.VIEW
        }

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu, token);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const favLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(favLink).toBeInTheDocument();
        expect(backLink).toHaveTextContent('Back to Analysis');
        expect(favLink).toHaveTextContent('Add To Favorites');

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSING);
        expect(setCurrentFood).toHaveBeenCalledWith({id: null, food: null});

        await user.click(favLink);
        expect(sendRequest).toHaveBeenCalledWith(
            '/foods',
            'POST',
            JSON.stringify({food: currentFood.food}),
            { 'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token }
        );
        expect(favLink).toHaveTextContent('Go To Favorites');
        expect(statusValue.setMessage).toHaveBeenCalledWith('Food added to favorites.');

    });

    it('should render openanalysis menu with food without token', async() => {

        const token = null;

        const currentFood: CurrentFood = {
            food: {
                food: {
                    nutrients: foodJSON.food.nutrients,
                    category: FoodType.GENERIC_FOODS,
                    categoryLabel: "food",
                    foodId: "food_a1gb9ubb72c7snbuxr3weagwv0dd",
                    image: "https://www.edamam.com/food-img/42c/42c006401027d35add93113548eeaae6.jpg",
                    knownAs: "apple",
                    label: "Apple"
                },
                measures: foodJSON.measures
            },
            id: foodJSON.food.foodId
        };

        const currentRecipe: CurrentRecipe = {
            id: null, 
            recipe: null, 
            image: null, 
            mode: AnalysisMode.VIEW
        };

        const currentMenu: CurrentMenu = {
            id: null, 
            menu: null, 
            mode: AnalysisMode.VIEW
        }

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu, token);

        const links = menu.querySelectorAll('.link');
        const favLink = links[1];

        await user.click(favLink);
        expect(sendRequest).not.toHaveBeenCalledWith();
        expect(favLink).not.toHaveTextContent('Go To Favorites');
        expect(statusValue.setMessage).not.toHaveBeenCalledWith('Food added to favorites.');

    });

    it('should render openanalysis menu with recipe and token', async() => {

        const token = 'token';

        const currentFood: CurrentFood = {
            food: null,
            id: null
        };

        const currentRecipe: CurrentRecipe = {
            id: recipeJSON.id, 
            recipe: recipeJSON.recipe, 
            image: recipeJSON.image, 
            mode: AnalysisMode.VIEW
        };

        const currentMenu: CurrentMenu = {
            id: null, 
            menu: null, 
            mode: AnalysisMode.VIEW
        }

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu, token);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const favLink = links[1];

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);

        await user.click(favLink);
        const formData = new FormData();
        const recipeString = JSON.stringify(currentRecipe.recipe);
        formData.append('recipe', recipeString);
        formData.append('image', props.file);
        expect(sendRequest).toHaveBeenCalledWith(
            '/recipes',
            'POST',
            formData, {
                Authorization: 'Bearer ' + token
            }
        );
        expect(favLink).toHaveTextContent('Go To Favorites');
        expect(statusValue.setMessage).toHaveBeenCalledWith('Recipe added to favorites.');

    });

    it('should render openanalysis menu with menu without token', async() => {

        const token = null;

        const currentFood: CurrentFood = {
            food: null,
            id: null
        };

        const currentRecipe: CurrentRecipe = {
            id: null, 
            recipe: null, 
            image: null, 
            mode: AnalysisMode.VIEW
        };

        const currentMenu: CurrentMenu = {
            id: menuJSON.id, 
            menu: menuJSON.menu, 
            mode: AnalysisMode.VIEW
        }

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu, token);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const favLink = links[1];

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);

        await user.click(favLink);
        expect(statusValue.setStatus).toHaveBeenCalledWith(StatusType.ERROR);
        expect(statusValue.setMessage).toHaveBeenCalledWith('You must be logged in to add menu to favorites.');
        expect(statusValue.setIsLoading).toHaveBeenCalledWith(false);
        expect(sendRequest).not.toHaveBeenCalled();

    });

    it('should render openanalysis menu with menu with token in edit mode', async() => {

        const token = 'token';

        const currentFood: CurrentFood = {
            food: null,
            id: null
        };

        const currentRecipe: CurrentRecipe = {
            id: null, 
            recipe: null, 
            image: null, 
            mode: AnalysisMode.VIEW
        };

        const currentMenu: CurrentMenu = {
            id: menuJSON.id, 
            menu: menuJSON.menu, 
            mode: AnalysisMode.EDIT
        }

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu, token);

        const links = menu.querySelectorAll('.link');
        const favLink = links[1];

        await user.click(favLink);

        const menuRecipes = currentMenu!.menu?.recipes.map(recipe => {
            return {
            selectedRecipe: recipe.selectedRecipeId,
            selectedServings: recipe.selectedServings
        }});
        const Menu = {
            name: currentMenu!.menu?.name,
            ingredients: currentMenu!.menu?.ingredients,
            recipes: menuRecipes
        };
        expect(sendRequest).toHaveBeenCalledWith(
            `/menus/${currentMenu.id}`,
            'PATCH',
            JSON.stringify({
            updatedMenu: Menu
            }),
            { 'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token }
        );
        expect(favLink).toHaveTextContent('Go To Favorites');
        expect(statusValue.setMessage).toHaveBeenCalledWith('Menu updated in favorites.');

    });
    
})