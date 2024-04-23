import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OpenCardMenu from './opencard-menu';
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

describe('opencard menu', () => {

    const sendRequest = jest.fn();

    (useHttpClient as jest.Mock).mockReturnValue({sendRequest});

    const push = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({push});

    const props = { 
        onFoodDelete: jest.fn()
    };
    
    const authValue = {
        isLoggedIn: false,
        token: '123',
        login: jest.fn(),
        logout: jest.fn()
    }

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

    const renderComponentWithContext = (food: CurrentFood, recipe: CurrentRecipe, menu: CurrentMenu) => {

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
                                    <OpenCardMenu { ...props} />
                                </StatusContext.Provider>
                            </CurrentMenuContext.Provider>
                        </CurrentRecipeContext.Provider>
                    </CurrentFoodContext.Provider>
                </CardOpenContext.Provider>
            </AuthContext.Provider>
        );

        return container
    } 

    it('should render opencard menu with food', async() => {

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

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const deleteLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(deleteLink).toBeInTheDocument();
        expect(deleteLink).toHaveTextContent('Delete');

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSING);
        expect(setCurrentFood).toHaveBeenCalledWith({id: null, food: null});
        expect(setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        expect(setCurrentMenu).toHaveBeenCalledWith({id: null, recipe: null, mode: AnalysisMode.VIEW});

        await user.click(deleteLink);
        expect(props.onFoodDelete).toHaveBeenCalled();
        expect(setCurrentFood).toHaveBeenCalledWith({id: null, food: null});
        expect(statusValue.setMessage).toHaveBeenCalledWith("Food deleted successfully");
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);
        expect(sendRequest).toHaveBeenCalledWith(  
            `/foods/${currentFood.id}`,
            'DELETE', null, {
                Authorization: 'Bearer ' + authValue.token
            });
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);

    });

    it('should render opencard menu with recipe', async() => {

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

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const editLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(editLink).toBeInTheDocument();
        expect(editLink).toHaveTextContent('Edit');

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSING);
        expect(setCurrentFood).toHaveBeenCalledWith({id: null, food: null});
        expect(setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        expect(setCurrentMenu).toHaveBeenCalledWith({id: null, recipe: null, mode: AnalysisMode.VIEW});

        await user.click(editLink);
        expect(push).toHaveBeenCalledWith('/analysis/recipe-analysis');
        expect(setCurrentRecipe).toHaveBeenCalledWith({id: currentRecipe.id, recipe: currentRecipe.recipe, image: currentRecipe.image, mode: AnalysisMode.EDIT});
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);

    });

    it('should render opencard menu with menu', async() => {

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

        const menu = renderComponentWithContext(currentFood, currentRecipe, currentMenu);

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const editLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(editLink).toBeInTheDocument();
        expect(editLink).toHaveTextContent('Edit');

        await user.click(backLink);
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSING);
        expect(setCurrentFood).toHaveBeenCalledWith({id: null, food: null});
        expect(setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        expect(setCurrentMenu).toHaveBeenCalledWith({id: null, recipe: null, mode: AnalysisMode.VIEW});

        await user.click(editLink);
        expect(push).toHaveBeenCalledWith('/analysis/menu-analysis');
        expect(setCurrentMenu).toHaveBeenCalledWith({id: currentMenu.id, menu: currentMenu.menu, mode: AnalysisMode.EDIT});
        expect(cardOpenValue.setCardOpen).toHaveBeenCalledWith(CardState.CLOSED);

    });
    
})