'use client'

import MenuList from "../../data-base/menu-list"
import PageGrid from "../page-grid"
import Card from "../card"
import { useMenu } from '@/app/context/menu-context'

const Menu = () => {

    const menus = useMenu();

    const menuList = menus.map((menu, index) => {
        return (
            <Card title={menu.name} text={'My menu'} key={menu.id} index={index + 1}/>
        )
    })

    return (
        <PageGrid>
            {menuList}
        </PageGrid>
    )
}

export default Menu