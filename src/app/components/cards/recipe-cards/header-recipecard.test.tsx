import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RecipeHeaderCard from './header-recipecard';
import recipe from '@/app/test_objects/loaded-recipe.json';

describe('food header card', () => {

    it('should render food header card', async() => {

        const props = {
            recipe: recipe.recipe,
            image: recipe.image
        };

        render(<RecipeHeaderCard {... props} />);

        screen.logTestingPlaygroundURL();
        const heading = screen.getByRole('heading');
        const weight = props.recipe.nutrients.totalWeight;
        const text = screen.getByText(new RegExp(`1 serving \\- ${weight}g`, 'i'));
        
        expect(text).toBeInTheDocument();
        expect(heading).toHaveTextContent(props.recipe.name);

    })
})