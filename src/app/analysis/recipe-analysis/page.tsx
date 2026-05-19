'use client'

import { useContext, useState } from 'react';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import Footer from '@/app/components/navigation/footer';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import RecipeForm from '../components/form/recipe-form';
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';

interface RecipeAnalysisProps {

}

const RecipeAnalysis = ({ }: RecipeAnalysisProps): JSX.Element => {

	const { cardOpen } = useContext(CardOpenContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	const [file, setFile] = useState<Blob | null>(null);

	return (
		<>
			<NavBar color="var(--primary-glass)" textColor="white">
				{cardOpen === CardState.OPEN ?
				<OpenAnalysisMenu file={file} setFile={setFile}/> :
				<AnalysisMenu
					rightText="Clear Form"
					onClear={() => setClearSearch(true)}
					setFile={setFile}
				/>
				}
			</NavBar>
			<RecipeForm searchCleared={clearSearch} setClearSearch={setClearSearch} setFile={setFile}/>
			<Footer color="var(--primary-glass)" textColor="white" setFile={setFile}/>
		</>  
	);
}

export default RecipeAnalysis;
