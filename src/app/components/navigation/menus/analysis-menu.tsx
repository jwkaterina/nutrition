import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Menu from './menu';
import { SlideContext} from '@/app/context/slide-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { AnalysisMode } from '@/app/types/types';

interface AnalysisMenuProps {
	setFile?: (file: any) => void
}

const AnalysisMenu = ({ setFile }: AnalysisMenuProps): JSX.Element => {

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
		setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
		setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
		setFile && setFile(null);
	}

	return (
		<Menu
		   leftText="Back To Favorites"
		   onLeftclick={onBackClick}
		/>
	);
}

export default AnalysisMenu;