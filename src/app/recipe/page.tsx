'use client'

import styles from './page.module.css'
import RecipeList from '../data-base/recipe-list'
import PageGrid from '../components/page-grid'
import Card from '../components/card'

const Recipe = () => {

    const recipeList = RecipeList.map(recipe => {
        return (
            <Card title={recipe.name} id={recipe.id} text={recipe.description} type={'preview'}/>
        )
    })

    return (
        <PageGrid>
            {recipeList}
        </PageGrid>
    )
}

export default Recipe