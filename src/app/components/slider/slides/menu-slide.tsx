
import { useEffect, useState, useContext } from 'react';
import Button from '@/app/components/slider/button';
import MenuCard from '../../cards/menu-cards/menu-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { LoadedMenu } from '@/app/types/types';

const MenuSlide = (): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [menuList, setMenuList] = useState<JSX.Element[]>([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if(!token) {
            setMenuList([]);
            return;
        }
        const fetchMenus = async () => {
            try {
                const responseData = await sendRequest(
                    `/menus`,'GET', null, {
                        Authorization: 'Bearer ' + token
                      }
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
    }, [token]);

    return (
         <Slide>
            {menuList.length > 0 && menuList}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>  
    );
}

export default MenuSlide;