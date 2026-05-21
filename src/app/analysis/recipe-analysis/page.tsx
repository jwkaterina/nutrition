'use client'

import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import Footer from '@/app/components/navigation/footer';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import RecipeForm from '../components/form/recipe-form';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CardState } from '@/app/types/types';

const RecipeAnalysis = (): JSX.Element => {

	const router = useRouter();
	const { cardOpen, setCardOpen } = useContext(CardOpenContext);
	const { currentRecipe } = useContext(CurrentRecipeContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	const [file, setFile] = useState<Blob | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useLayoutEffect(() => {
		const isEdit = new URLSearchParams(window.location.search).get('edit') === '1';
		if (isEdit) setCardOpen(CardState.CLOSED);
	}, []);

	useEffect(() => {
		const isEdit = new URLSearchParams(window.location.search).get('edit') === '1';
		if (isEdit && !currentRecipe.recipe) router.replace('/');
	}, []);

	return (
		<>
			<NavBar color="var(--primary-glass)" textColor="white">
				{cardOpen === CardState.OPEN ?
				<OpenAnalysisMenu file={file} setFile={setFile} imageUrl={imageUrl} setImageUrl={setImageUrl}/> :
				<AnalysisMenu setFile={setFile} />
				}
			</NavBar>
			<RecipeForm searchCleared={clearSearch} setClearSearch={setClearSearch} file={file} setFile={setFile} imageUrl={imageUrl} setImageUrl={setImageUrl}/>
			<Footer color="var(--primary-glass)" textColor="white" setFile={setFile}/>
		</>  
	);
}

export default RecipeAnalysis;
