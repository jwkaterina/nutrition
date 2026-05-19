'use client'

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';
import Footer from '@/app/components/navigation/footer';
import MenuForm from '../components/form/menu-form';
import NavBar from '@/app/components/navigation/nav-bar';
import OpenAnalysisMenu from '@/app/components/navigation/menus/openanalysis-menu';
import { CardOpenContext } from '@/app/context/card-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { CardState } from '@/app/types/types';

const MenuSearch = (): JSX.Element => {

	const router = useRouter();
	const { cardOpen } = useContext(CardOpenContext);
	const { currentMenu } = useContext(CurrentMenuContext);
	const [clearSearch, setClearSearch] = useState<boolean>(false);

	useEffect(() => {
		const isEdit = new URLSearchParams(window.location.search).get('edit') === '1';
		if (isEdit && !currentMenu.menu) router.replace('/');
	}, []);

	return (
		<>
			<NavBar color="var(--primary-glass)" textColor="white">
				{cardOpen === CardState.OPEN ?
				<OpenAnalysisMenu/> :
				<AnalysisMenu
					rightText="Clear Form"
					onClear={() => setClearSearch(true)}
				/>
				}
			</NavBar>
			<MenuForm searchCleared={clearSearch} setClearSearch={setClearSearch}/>
			<Footer color="var(--primary-glass)" textColor="white" />
		</>  
	);
}

export default MenuSearch;
