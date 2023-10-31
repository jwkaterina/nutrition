'use client'

import RecipeList from '../../data-base/recipe-list'
import PageGrid from '../page-grid'
import Card from '../card'
import { useRecipe } from '@/app/context/recipe-context'

const Recipe = () => {

    const recipes = useRecipe();

    const recipeList = recipes.map((recipe, index) => {
        return (
            <Card title={recipe.name} text={recipe.description} key={recipe.id} index={index + 1}/>
        )
    })

    return (
        <PageGrid search={'analysis/recipe-analysis'}>
            {recipeList}
        </PageGrid>
    )
}

export default Recipe