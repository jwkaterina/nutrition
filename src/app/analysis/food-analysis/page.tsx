'use client'

import { useContext, useState } from 'react';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import Footer from '@/app/components/navigation/footer';
import FoodSearch from '../components/serach/food-search';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';

const FoodAnalysis = (): JSX.Element => {

	const { cardOpen } = useContext(CardOpenContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	
	const secondaryColor: string = "var(--secondary-color)";

	return (
		<>
			<NavBar color={secondaryColor}>
				{cardOpen == CardState.OPEN ? 
				<OpenAnalysisMenu /> : 
				<AnalysisMenu 
					rightText="Clear Search"
					onClear={() => setClearSearch(true)}
				/>
				}
			</NavBar>
			<FoodSearch searchCleared={clearSearch} setClearSearch={setClearSearch}/>
			<Footer color={secondaryColor} />
		</>
	);
}

export default FoodAnalysis;

