import { Recipe, CardState } from '@/app/types/types'
import Card from '../card'
import { useContext, useState } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { CurrentRecipeContext } from '@/app/context/recipe-context'
import OpenRecipeCard from './open-recipecard'
import ClosedCard from '../closed-card'

interface RecipeCardProps {
    recipe: Recipe,
    index: number,
    id: string | null,
    open: boolean
}

const RecipeCard = ({ recipe, index, id, open }: RecipeCardProps): JSX.Element => {

    const [isOpen, setIsOpen] = useState<boolean>(open);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setCurrentRecipe } = useContext(CurrentRecipeContext);

    const handleCardClick = () => {
        if(isOpen) {
            return 
        }
        setCardOpen(CardState.OPEN);
        setIsOpen(true); 

        setCurrentRecipe({
            recipe: recipe,
            id: id
        });
    }

    return <Card index={index} onCardClick={handleCardClick} setIsOpen={setIsOpen} isOpen={isOpen}> 
            {isOpen ? <OpenRecipeCard recipe={recipe}/> : 
            <ClosedCard 
                title={recipe.name}
                image={recipe.image}
                calories={recipe.nutrients.calories}
                protein={recipe.nutrients.totalNutrients.PROCNT.quantity}
                fat={recipe.nutrients.totalNutrients.FAT.quantity}
                carbs={recipe.nutrients.totalNutrients.CHOCDF.quantity}
            />}
        </Card>
}

export default RecipeCard