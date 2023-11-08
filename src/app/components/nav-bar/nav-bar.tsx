'use client'

// import Link from "next/link"
import styles from "./nav-bar.module.css"
// import { usePathname} from 'next/navigation';

interface NavBarProps {
    color: string,
    children: React.ReactNode,
}

const NavBar = ({ color, children }: NavBarProps): JSX.Element => {

    // const pathname = usePathname();


    return (
        <nav className={styles.container} style={{background: color}}>
            {/* <Link href="/" className={pathname == "/" ? `${styles.active} ${styles.link}` : styles.link}>Home
            </Link> */}
            {/* <Link href="/food" className={pathname == "/food" ? `${styles.active} ${styles.link}` : styles.link}>Food
            </Link>
            <Link href="/recipe" className={pathname == "/recipe" ? `${styles.active} ${styles.link}` : styles.link}>Recipe
            </Link>
            <Link href="/menu" className={pathname == "/menu" ? `${styles.active} ${styles.link}` : styles.link}>Menu
            </Link> */}
            {children}
        </nav>
    )
}

export default NavBar

