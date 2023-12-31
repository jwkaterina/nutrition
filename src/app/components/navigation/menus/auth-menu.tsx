'use client'

import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { SetBlockScrollContext } from '@/app/context/slide-context'

interface AuthMenuProps {

}

const AuthMenu = ({ }: AuthMenuProps): JSX.Element => {

	const router = useRouter();
    const setBlockScroll = useContext(SetBlockScrollContext);

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
	)
}

export default AuthMenu