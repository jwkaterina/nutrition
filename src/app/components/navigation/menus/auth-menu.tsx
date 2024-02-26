import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Menu from './menu';
import { SlideContext } from '@/app/context/slide-context';

const AuthMenu = (): JSX.Element => {

	const router = useRouter();
    const { setBlockScroll } = useContext(SlideContext);

    const backHandler = () => {
        setBlockScroll(true);
		router.back();
		setTimeout(() => {
			setBlockScroll(false);
		}, 500);
    }

	const homeHandler = () => {
		setBlockScroll(true);
		router.push('/');
		setTimeout(() => {
			setBlockScroll(false);
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