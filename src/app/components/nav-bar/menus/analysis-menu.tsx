'use client'

import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { SetCardOpenContext } from '@/app/context/card-context'

interface AnalysisMenuProps {
    title: string,
	onHeaderClick: () => void,
}

const AnalysisMenu = ({ title, onHeaderClick }: AnalysisMenuProps): JSX.Element => {

	const setCardOpen = useContext(SetCardOpenContext);
	const router = useRouter();

	const onBackClick = (): void => {
		setCardOpen(null);
		router.push('/');
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