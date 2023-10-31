'use client'

import MenuList from "../../data-base/menu-list"
import PageGrid from "../page-grid"
import Card from "../card"

export type MenuProp = {
    id: number,
    name: string,
}

const Menu = () => {

    let initialMenus: MenuProp[];
    if(localStorage.getItem('menus')) {
      initialMenus = JSON.parse(localStorage.getItem('menus')!)
    } else {
        initialMenus = MenuList;
        localStorage.setItem('menus', JSON.stringify(initialMenus))
    } 

    const menuList = initialMenus.map((menu, index) => {
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