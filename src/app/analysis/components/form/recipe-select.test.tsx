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
                selectedRecipeId: loadedRecipe.id,
                selectedRecipe: loadedRecipe.recipe,
                selectedServings: 2
            }],
            loadedRecipes: [loadedRecipe]
        }
        
        render(<RecipeSelect {...props} />);
   
        const plusButton = screen.getByText(/\+/i);

        await user.click(plusButton);
        expect(props.setCurrentRecipes).toHaveBeenCalledWith([{
            selectedRecipeId: loadedRecipe.id,
            selectedRecipe: loadedRecipe.recipe,
            selectedServings: 3
        }]);

    });

    it('should render recipe-select', async() => {
        const props = {
            inputs: 1,
            setCurrentRecipes: jest.fn(),
            currentRecipes: [{
                selectedRecipeId: loadedRecipe.id,
                selectedRecipe: loadedRecipe.recipe,
                selectedServings: 2
            }],
            loadedRecipes: [loadedRecipe]
        }
        
        render(<RecipeSelect {...props} />);

        const selectInput = screen.getByRole('combobox');

        await user.selectOptions(selectInput, 'Recipe 40');
        expect(props.setCurrentRecipes).toHaveBeenCalledWith([{
            selectedRecipeId: loadedRecipe.id,
            selectedRecipe: loadedRecipe.recipe,
            selectedServings: 2
        }]);

    });
});