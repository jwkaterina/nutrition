'use client'

import { useContext } from 'react' 
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import { CardOpenContext } from '@/app/context/card-context';
import Footer from '@/app/components/navigation/footer';
import FoodSearch from './food-search';

interface FoodAnalysisProps {

}

const FoodAnalysis = ({ }: FoodAnalysisProps): JSX.Element => {

	const cardOpen = useContext(CardOpenContext);
	
	const secondaryColor = "var(--secondary-color)";

	return (<>
		<NavBar color={secondaryColor}>
			{cardOpen ? 
			<OpenAnalysisMenu /> : 
			<AnalysisMenu title="Food"/>
			}
		</NavBar>
		<FoodSearch />
		{!cardOpen && <Footer color={secondaryColor} />}
	</>)
}

export default FoodAnalysis

