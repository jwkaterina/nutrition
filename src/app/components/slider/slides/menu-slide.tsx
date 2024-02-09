import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedMenu } from '@/app/types/types'
import MenuCard from '../../cards/menu-cards/menu-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import  LoadingSpinner from '@/app/components/utilities/loading/loading-spinner';import Toast from '../../utilities/toast/toast';

interface MenuSlideProps {
}

const MenuSlide = ({ }: MenuSlideProps): JSX.Element => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [menuList, setMenuList] = useState<JSX.Element[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchMenus = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/menus/user/${user}`
                );
                const menuList = responseData.menus.map((menu: LoadedMenu, index: number) => {
                    return (
                        <MenuCard menu={menu.menu} index={index + 1} key={index + 1} id={menu.id} open={false}/>
                    )
                })
                setMenuList(menuList);
            } catch (err) {}
        };
        fetchMenus();
    }, []);

    return (<>
        <Toast active ={error ? true : false} status={'Error'} message={error ? error : ''} clearMessage={clearError} />
        {isLoading && <LoadingSpinner />}
         <Slide>
            {menuList.length > 0 && menuList}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>  
    </>)
}

export default MenuSlide