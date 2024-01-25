'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import Footer from '@/app/components/navigation/footer';
import { CardOpenContext } from '@/app/context/card-context';
import { useContext, useState } from 'react';
import MenuForm from '../components/form/menu-form';
import { CardState } from '@/app/types/types';

const MenuSearch = (): JSX.Element => {

	const { cardOpen } = useContext(CardOpenContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);

	const secondaryColor: string = "var(--secondary-color)";

	return (<>
			<NavBar color={secondaryColor}>
				{cardOpen == CardState.OPEN ? 
				<OpenAnalysisMenu/> : 
				<AnalysisMenu onClear={() => setClearSearch(true)}/>
				}
			</NavBar>
			<MenuForm searchCleared={clearSearch} setClearSearch={setClearSearch}/>
			{cardOpen != CardState.OPEN && <Footer color={secondaryColor} />}
		</>  )
}

export default MenuSearch
