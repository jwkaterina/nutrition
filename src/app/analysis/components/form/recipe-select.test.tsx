import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import RecipeSelect from './recipe-select';
import loadedRecipe from '../../../test_objects/loaded-recipe.json';

describe('recipe-select', () => {

    it('should render recipe-select', async() => {
        const props = {
            inputs: 1,
            setCurrentRecipes: jest.fn(),
            currentRecipes: [{
                selectedRecipe: loadedRecipe.recipe,
                selectedServings: 2
            }],
            loadedRecipes: [loadedRecipe]
        }
        
        render(<RecipeSelect {...props} />);
   
        const numberInput = screen.getByRole('spinbutton', {
            name: /servings/i
        });

        await user.type(numberInput, '5');
        expect(props.setCurrentRecipes).toHaveBeenCalledWith([{
            selectedRecipe: loadedRecipe.recipe,
            selectedServings: 25
        }]);

        screen.logTestingPlaygroundURL();

    });

    it('should render recipe-select', async() => {
        const props = {
            inputs: 1,
            setCurrentRecipes: jest.fn(),
            currentRecipes: [{
                selectedRecipe: loadedRecipe.recipe,
                selectedServings: 2
            }],
            loadedRecipes: [loadedRecipe]
        }
        
        render(<RecipeSelect {...props} />);


        const selectInput = screen.getByRole('combobox');

        await user.selectOptions(selectInput, 'Recipe 40');
        expect(props.setCurrentRecipes).toHaveBeenCalledWith([{
            selectedRecipe: loadedRecipe.recipe,
            selectedServings: 2
        }]);

        screen.logTestingPlaygroundURL();

    });
});