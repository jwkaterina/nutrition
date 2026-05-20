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
import pageStyles from './food-analysis.module.css';

const TAB_BAR_HEIGHT = '3rem';
const TOP_WITH_TABS = `calc(var(--header-height) + ${TAB_BAR_HEIGHT})`;

const FoodAnalysis = (): JSX.Element => {

	const router = useRouter();
	const { cardOpen } = useContext(CardOpenContext);
	const { setScrollBehavior } = useContext(SlideContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);
	const [manual, setManual] = useState<boolean>(false);

	const showTabs = cardOpen !== CardState.OPEN;

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
					rightText="Clear Search"
					onClear={() => setClearSearch(true)}
				/>
				}
			</NavBar>

			{showTabs && (
				<div className={pageStyles.tab_bar}>
					<button
						className={manual ? pageStyles.tab : `${pageStyles.tab} ${pageStyles.tab_active}`}
						onClick={() => setManual(false)}
					>Search</button>
					<button
						className={manual ? `${pageStyles.tab} ${pageStyles.tab_active}` : pageStyles.tab}
						onClick={() => setManual(true)}
					>Add Manually</button>
				</div>
			)}

			{manual
				? <ManualFoodForm onSaved={handleSaved} topPad={TOP_WITH_TABS} />
				: <FoodSearch
					searchCleared={clearSearch}
					setClearSearch={setClearSearch}
					topPad={showTabs ? TOP_WITH_TABS : undefined}
				/>
			}
			<Footer color="var(--primary-glass)" textColor="white" />
		</>
	);
}

export default FoodAnalysis;
