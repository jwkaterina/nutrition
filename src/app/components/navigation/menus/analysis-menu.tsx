'use client'

import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { SetCardOpenContext } from '@/app/context/card-context'
import { SetScrollBehaviorContext} from '@/app/context/slide-context'

interface AnalysisMenuProps {
    title: string
}

const AnalysisMenu = ({ title }: AnalysisMenuProps): JSX.Element => {

	const setCardOpen = useContext(SetCardOpenContext);
	const router = useRouter();
	const setScrollBehavior = useContext(SetScrollBehaviorContext);

	const onBackClick = (): void => {
		setCardOpen(null);
		setScrollBehavior('auto');
		router.push('/');
		setTimeout(() => {
			setScrollBehavior('smooth');
		}, 500);
	}

	return (
		<Menu 
		   leftText="Back To Favorites" 
		   rightText= {`${title} Analysis`}
		   onLeftclick={onBackClick} 
		   onRightclick={() => {}}
		/>
	)
}

export default AnalysisMenu