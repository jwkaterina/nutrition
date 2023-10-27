'use client'

// import Link from "next/link"
import styles from "./nab-bar.module.css"
// import { usePathname} from 'next/navigation';
import Food from "../food/page"
import { Slide } from "../page"


const NavBar = ({ scrollTo }) => {

    // const pathname = usePathname();

    return (
        <nav className={styles.container}>
            {/* <Link href="/" className={pathname == "/" ? `${styles.active} ${styles.link}` : styles.link}>Home
            </Link> */}
            {/* <Link href="/food" className={pathname == "/food" ? `${styles.active} ${styles.link}` : styles.link}>Food
            </Link>
            <Link href="/recipe" className={pathname == "/recipe" ? `${styles.active} ${styles.link}` : styles.link}>Recipe
            </Link>
            <Link href="/menu" className={pathname == "/menu" ? `${styles.active} ${styles.link}` : styles.link}>Menu
            </Link> */}
            <a className={styles.link} onClick={() => scrollTo(Slide.FOOD)}>Food</a>
            <a className={styles.link} onClick={() => scrollTo(Slide.RECIPE)}>Recipe</a>
            <a className={styles.link} onClick={() => scrollTo(Slide.MENU)}>Menu</a>
        </nav>
    )
}

export default NavBar