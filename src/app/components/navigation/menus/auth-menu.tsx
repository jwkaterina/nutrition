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

	return (
		<Menu 
		   leftText="Back" 
		   rightText= 'Auhtentication'
		   onLeftclick={backHandler} 
		   onRightclick={() => {}}  
		/>
	);
}

export default AuthMenu;