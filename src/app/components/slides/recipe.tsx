'use client'

import Card from '../card'
import { useRecipe } from '@/app/context/recipe-context'
import Slide from './slide'
import Button from '@/app/components/button'

const Recipe = () => {

    const recipes = useRecipe();

    const recipeList = recipes.map((recipe, index) => {
        return (
            <Card title={recipe.name} text={recipe.description} key={recipe.id} index={index + 1} imgUrl='' measures={[]}/>
        )
    })

    return (
        <Slide>
            {recipeList}
            <Button search={'analysis/recipe-analysis'}/>
        </Slide>    
    )
}

export default Recipe