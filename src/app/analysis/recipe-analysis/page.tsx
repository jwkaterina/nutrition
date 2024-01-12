'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import Footer from '@/app/components/navigation/footer';
import { CardOpenContext } from '@/app/context/card-context';
import { useContext } from 'react';
import RecipeForm from './recipe-form';
import { CardState } from '@/app/types/types';

const RecipeAnalysis = (): JSX.Element => {

  const cardOpen = useContext(CardOpenContext);

  const secondaryColor = "var(--secondary-color)";

  return (<>
  		<NavBar color={secondaryColor}>
			{cardOpen == CardState.OPEN ? 
			<OpenAnalysisMenu /> : 
			<AnalysisMenu title="Recipe"/>
			}
		</NavBar>
		<RecipeForm />
		{cardOpen == CardState.CLOSED && <Footer color={secondaryColor} />}
    </>  )
}

export default RecipeAnalysis
