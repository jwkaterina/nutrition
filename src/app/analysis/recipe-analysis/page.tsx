'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import Footer from '@/app/components/navigation/footer';
import { CardOpenContext } from '@/app/context/card-context';
import { useContext, useState } from 'react';
import RecipeForm from '../components/form/recipe-form';
import { CardState } from '@/app/types/types';

interface RecipeAnalysisProps {

}

const RecipeAnalysis = ({ }: RecipeAnalysisProps): JSX.Element => {

	const { cardOpen } = useContext(CardOpenContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	const [file, setFile] = useState<FormData | null>(null);

	const secondaryColor: string = "var(--secondary-color)";

	return (<>
			<NavBar color={secondaryColor}>
				{cardOpen == CardState.OPEN ? 
				<OpenAnalysisMenu file={file} setFile={setFile}/> : 
				<AnalysisMenu 
					rightText="Clear Form"
					onClear={() => setClearSearch(true)}
					setFile={setFile}
				/>
				}
			</NavBar>
			<RecipeForm searchCleared={clearSearch} setClearSearch={setClearSearch} setFile={setFile}/>
			<Footer color={secondaryColor} setFile={setFile}/>
		</>  )
}

export default RecipeAnalysis
