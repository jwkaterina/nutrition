'use client'

import RecipeList from '../../data-base/recipe-list'
import PageGrid from '../page-grid'
import Card from '../card'

const Recipe = () => {

    const recipeList = RecipeList.map((recipe, index) => {
        return (
            <Card title={recipe.name} text={recipe.description} key={recipe.id} index={index + 1}/>
        )
    })

    return (
        <PageGrid>
            {recipeList}
        </PageGrid>
    )
}

export default Recipe