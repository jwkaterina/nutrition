'use client'

import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { SetCardOpenContext } from '@/app/context/card-context'
import { SetBlockScrollContext } from '@/app/context/slide-context'

interface AnalysisMenuProps {
    title: string,
	onHeaderClick: () => void,
}

const AnalysisMenu = ({ title, onHeaderClick }: AnalysisMenuProps): JSX.Element => {

	const setCardOpen = useContext(SetCardOpenContext);
	const router = useRouter();
	const setBlockScroll = useContext(SetBlockScrollContext);

	const onBackClick = (): void => {
		console.log('back');
		setCardOpen(null);
		setBlockScroll(true);
		router.push('/');
		setTimeout(() => {
			setBlockScroll(false);
		}, 500);
	}

	return (
		<Menu 
		   leftText="Back To Favorites" 
		   rightText= {`${title} Analysis`}
		   onLeftclick={onBackClick} 
		   onRightclick={onHeaderClick}  
		/>
	)
}

export default AnalysisMenu