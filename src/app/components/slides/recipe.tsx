'use client'

import RecipeList from '../../data-base/recipe-list'
import PageGrid from '../page-grid'
import Card from '../card'

export type RecipeProp =     {
    id: number,
    name: string,
    description: string,
    imagePath: string,
    ingredients: Ingredient[]
}

type Ingredient = {
    name: string,
    amount: number
}

const Recipe = () => {

    let initialRecipes: RecipeProp[];
    if(localStorage.getItem('recipes')) {
      initialRecipes = JSON.parse(localStorage.getItem('recipes')!)
    } else {
        initialRecipes = RecipeList;
        localStorage.setItem('recipes', JSON.stringify(initialRecipes))
    }   

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