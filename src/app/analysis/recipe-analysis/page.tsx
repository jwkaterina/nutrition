'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';

const RecipeSearch = (): JSX.Element => {

  return (<>
   	<NavBar color={'var(--secondary-color)'}>
        <AnalysisMenu title="Food"/>
    </NavBar>
    <h1>Recipe Search</h1>
    </>  )
}

export default RecipeSearch
