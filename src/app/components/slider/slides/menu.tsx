'use client'

import Card from "../../cards/card"
// import { useMenu } from '@/app/context/menu-context'
import Slide from './slide'
import Button from '@/app/components/slider/button'

const Menu = () => {

    // const menus = useMenu();

    // const menuList = menus.map((menu, index) => {
    //     return (
    //         <Card title={menu.name} text={'My menu'} key={menu.id} index={index + 1} imgUrl="" measures={[]}/> 
    //     )
    // })

    return (
        <Slide>
            {/* {menuList} */}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>    
    )
}

export default Menu