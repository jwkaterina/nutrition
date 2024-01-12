'use client'

import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { SlideContext} from '@/app/context/slide-context'
import { CardState } from '@/app/types/types'

interface AnalysisMenuProps {
    title: string
}

const AnalysisMenu = ({ title }: AnalysisMenuProps): JSX.Element => {

	const { setCardOpen } = useContext(CardOpenContext);
	const router = useRouter();
	const { setScrollBehavior } = useContext(SlideContext);

	const onBackClick = (): void => {
		setCardOpen(CardState.CLOSED);
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