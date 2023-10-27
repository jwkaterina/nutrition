'use client'

import RecipeList from '../../data-base/recipe-list'
import PageGrid from '../page-grid'
import Card from '../card'

const Recipe = () => {

    const recipeList = RecipeList.map(recipe => {
        return (
            <Card title={recipe.name} text={recipe.description} type={'preview'} key={recipe.id}/>
        )
    })

    return (
        <PageGrid>
            {recipeList}
        </PageGrid>
    )
}

export default Recipe