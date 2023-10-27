'use client'

import styles from './page.module.css'
import MenuList from "../data-base/menu-list"
import PageGrid from "../components/page-grid"
import Card from "../components/card"

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