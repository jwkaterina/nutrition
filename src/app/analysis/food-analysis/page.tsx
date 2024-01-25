'use client'

import { useContext, useState } from 'react' 
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import { CardOpenContext } from '@/app/context/card-context';
import Footer from '@/app/components/navigation/footer';
import FoodSearch from '../components/serach/food-search';
import { CardState } from '@/app/types/types';

interface FoodAnalysisProps {

}

const FoodAnalysis = ({ }: FoodAnalysisProps): JSX.Element => {

	const { cardOpen } = useContext(CardOpenContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	
	const secondaryColor: string = "var(--secondary-color)";

	return (<>
		<NavBar color={secondaryColor}>
			{cardOpen == CardState.OPEN ? 
			<OpenAnalysisMenu /> : 
			<AnalysisMenu onClear={() => setClearSearch(true)}/>
			}
		</NavBar>
		<FoodSearch searchCleared={clearSearch} setClearSearch={setClearSearch}/>
		{cardOpen != CardState.OPEN && <Footer color={secondaryColor} />}
	</>)
}

export default FoodAnalysis

