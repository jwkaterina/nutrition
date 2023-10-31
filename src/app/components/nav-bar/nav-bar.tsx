'use client'

// import Link from "next/link"
import styles from "./nav-bar.module.css"
// import { usePathname} from 'next/navigation';
import { Slide } from "../../page"
import { CardOpenContext, SetCardOpenContext } from "@/app/context/context"
import { useContext } from "react"
import MainMenu from "./main-menu"
import OpenCardMenu from "./opencard-menu"

interface NavBarProps {
    slide: Slide,
    setSlide: (slide: Slide) => void,
    setBlockScrollHandler: (blockScrollHandler: boolean) => void,
}

const NavBar = ({ slide, setSlide, setBlockScrollHandler }: NavBarProps): JSX.Element => {

    // const pathname = usePathname();

    const cardOpen = useContext(CardOpenContext);

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
            {cardOpen ? 
            <OpenCardMenu 
                slide={slide}
                cardOpen={cardOpen}
            /> : 
            <MainMenu 
                slide={slide} 
                setSlide={setSlide}
                setBlockScrollHandler={setBlockScrollHandler}
            />}
        </nav>
    )
}

export default NavBar

