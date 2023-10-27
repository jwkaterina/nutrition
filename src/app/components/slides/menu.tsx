'use client'

import MenuList from "../../data-base/menu-list"
import PageGrid from "../page-grid"
import Card from "../card"

const Menu = () => {

    const menuList = MenuList.map(menu => {
        return (
            <Card title={menu.name} text={'My menu'} type={'preview'} key={menu.id}/>
        )
    })

    return (
        <PageGrid>
            {menuList}
        </PageGrid>
    )
}

export default Menu