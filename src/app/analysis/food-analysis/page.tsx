'use client'

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import Footer from '@/app/components/navigation/footer';
import FoodSearch from '../components/serach/food-search';
import ManualFoodForm from '../components/form/manual-food-form';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import { CardOpenContext } from '@/app/context/card-context';
import { SlideContext } from '@/app/context/slide-context';
import { CardState } from '@/app/types/types';

const FoodAnalysis = (): JSX.Element => {

	const router = useRouter();
	const { cardOpen } = useContext(CardOpenContext);
	const { setScrollBehavior } = useContext(SlideContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	const [manual, setManual] = useState<boolean>(false);

	const handleSaved = () => {
		setScrollBehavior('auto');
		router.push('/?tab=food');
		setTimeout(() => setScrollBehavior('smooth'), 500);
	};

	return (
		<>
			<NavBar color="var(--primary-glass)" textColor="white">
				{cardOpen === CardState.OPEN ?
				<OpenAnalysisMenu /> :
				<AnalysisMenu
					rightText={manual ? 'Search Food' : 'Add Manually'}
					onClear={manual ? () => setManual(false) : () => setManual(true)}
				/>
				}
			</NavBar>
			{manual
				? <ManualFoodForm onSaved={handleSaved} />
				: <FoodSearch searchCleared={clearSearch} setClearSearch={setClearSearch}/>
			}
			<Footer color="var(--primary-glass)" textColor="white" />
		</>
	);
}

export default FoodAnalysis;
