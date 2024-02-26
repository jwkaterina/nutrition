import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Menu from './menu';
import { SlideContext } from '@/app/context/slide-context';

const AuthMenu = (): JSX.Element => {

	const router = useRouter();
    const { setScrollBehavior } = useContext(SlideContext);

    const backHandler = () => {
        setScrollBehavior('auto');
		router.back();
		setTimeout(() => {
			setScrollBehavior('smooth');
		}, 500);
    }

	const homeHandler = () => {
		setScrollBehavior('auto');
		router.push('/');
		setTimeout(() => {
			setScrollBehavior('smooth');
		}, 500);
	}

	return (
		<Menu 
		   leftText="Back" 
		   rightText= 'Home'
		   onLeftclick={backHandler} 
		   onRightclick={homeHandler}  
		/>
	);
}

export default AuthMenu;