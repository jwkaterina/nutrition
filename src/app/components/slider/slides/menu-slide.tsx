import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedMenu } from '@/app/types/types'
import MenuCard from '../../cards/menu-cards/menu-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import { StatusContext } from '@/app/context/status-context'

interface MenuSlideProps {
}

const MenuSlide = ({ }: MenuSlideProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [menuList, setMenuList] = useState<JSX.Element[]>([]);
    const { setMessage } = useContext(StatusContext);

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
            } catch (err) {
                setMessage("Could not fetch menu. Try again later.");
            }
        };
        fetchMenus();
    }, []);

    return (<>
         <Slide>
            {menuList.length > 0 && menuList}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>  
    </>)
}

export default MenuSlide