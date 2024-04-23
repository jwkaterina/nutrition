import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AuthMenu from './analysis-menu';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import {  useRouter } from 'next/navigation';
import recipe from '@/app/test_objects/loaded-recipe.json';
import menu from '@/app/test_objects/menu1.json';
import { AnalysisMode } from '@/app/types/types';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('analysis menu', () => {

    const mockRouter = {
        push: jest.fn()
    };
  
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const props = {
        onClear: jest.fn(),
        rightText: 'Clear Search',
        setFile: jest.fn()
    }

    const recipeValue = {
        currentRecipe: {
            id: recipe.id, 
            recipe: recipe.recipe, 
            image: recipe.image, 
            mode: AnalysisMode.VIEW
        },
        setCurrentRecipe: jest.fn()
    };

    const menuValue = {
        currentMenu: {
            id: menu.id, 
            menu: menu.menu, 
            mode: AnalysisMode.VIEW
        },
        setCurrentMenu: jest.fn()
    }


    const renderComponentWithContext = () => {

        const { container } = render(
            <CurrentRecipeContext.Provider value={recipeValue}>
                <CurrentMenuContext.Provider value={menuValue}>
                    <AuthMenu { ...props }/>
                </CurrentMenuContext.Provider>
            </CurrentRecipeContext.Provider>);
        return container
    } 

    it('should render analysis menu', async() => {

        const menu = renderComponentWithContext();

        const links = menu.querySelectorAll('.link');
        const backLink = links[0];
        const clearLink = links[1];

        expect(backLink).toBeInTheDocument();
        expect(clearLink).toBeInTheDocument();

        await user.click(backLink);

        expect(mockRouter.push).toHaveBeenCalledWith('/');
        expect(props.setFile).toHaveBeenCalledWith(null);
        expect(recipeValue.setCurrentRecipe).toHaveBeenCalledWith({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        expect(menuValue.setCurrentMenu).toHaveBeenCalledWith({id: null, menu: null, mode: AnalysisMode.VIEW});

        await user.click(clearLink);
        expect(props.onClear).toHaveBeenCalled();
    });
    
})