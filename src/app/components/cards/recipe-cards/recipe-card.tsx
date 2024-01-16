import { Recipe, CardState } from '@/app/types/types'
import Card from '../card'
import { useContext, useState } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { CurrentRecipeContext } from '@/app/context/recipe-context'
import OpenRecipeCard from './open-recipecard'
import ClosedRecipeCard from './closed-recipecard'

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
            {isOpen ? <OpenRecipeCard recipe={recipe}/> : <ClosedRecipeCard recipe={recipe}/>}
        </Card>
}

export default RecipeCard