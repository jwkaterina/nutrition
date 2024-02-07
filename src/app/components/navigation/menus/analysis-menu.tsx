import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { CardOpenContext } from '@/app/context/card-context'
import { SlideContext} from '@/app/context/slide-context'
import { CurrentRecipeContext } from '@/app/context/recipe-context'
import { CurrentMenuContext } from '@/app/context/menu-context'
import { CardState } from '@/app/types/types'

interface AnalysisMenuProps {
	onClear: () => void,
	rightText: string
}

const AnalysisMenu = ({ onClear, rightText }: AnalysisMenuProps): JSX.Element => {

	const { setCardOpen } = useContext(CardOpenContext);
	const router = useRouter();
	const { setScrollBehavior } = useContext(SlideContext);
	const { setCurrentRecipe} = useContext(CurrentRecipeContext);
	const { setCurrentMenu } = useContext(CurrentMenuContext);

	const onBackClick = (): void => {
		setScrollBehavior('auto');
		router.push('/');
		setTimeout(() => {
			setScrollBehavior('smooth');
		}, 500);
		setCurrentRecipe({id: null, recipe: null});
		setCurrentMenu({id: null, menu: null});
	}

	return (
		<Menu 
		   leftText="Back To Favorites" 
		   rightText= {rightText}
		   onLeftclick={onBackClick} 
		   onRightclick={() => onClear()}
		/>
	)
}

export default AnalysisMenu