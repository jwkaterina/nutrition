'use client'

import styles from './nav-bar.module.css'

interface NavBarProps {
    header: string
}

const NavBar = ({ header }: NavBarProps): JSX.Element => {
    return (
        <nav className={styles.container}>
                <h1 className={styles.header}>{header}</h1>
        </nav>
    )
}

export default NavBar