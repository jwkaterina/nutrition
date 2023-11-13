'use client'

import styles from "./nav-bar.module.css"

interface NavBarProps {
    color: string,
    children: React.ReactNode,
}

const NavBar = ({ color, children }: NavBarProps): JSX.Element => {

    return (
        <nav className={styles.container} style={{background: color}}>
            {children}
        </nav>
    )
}

export default NavBar

