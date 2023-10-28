'use client'

// import Link from "next/link"
import styles from "./nab-bar.module.css"
// import { usePathname} from 'next/navigation';
import { Slide } from "../page"


const NavBar = ({ slide, scrollTo }) => {

    // const pathname = usePathname();

    const linkWidth = 100;
    const scrollBarWidth = '20vw';

    const calculateScrollBarPosition = () => {
        const spaceWidth = `(100vw - 3 * ${linkWidth}px) / 4`;
        const position1 = `calc(${spaceWidth} + ${linkWidth}px / 2 - ${scrollBarWidth} / 2)`;   
        const position2 = `calc(2 * ${spaceWidth} + ${linkWidth}px / 2 * 3 - ${scrollBarWidth} / 2)`;
        const position3 = `calc(3 * ${spaceWidth} + ${linkWidth}px / 2 * 5 - ${scrollBarWidth} / 2)`;
        let position;
        switch(slide) {
            case Slide.FOOD:
                position = position1;
                break;
            case Slide.RECIPE:
                position = position2;
                break;
            case Slide.MENU:
                position = position3;
                break;
            default:
                position = position1;
        }
        return {
            left: position,
            width: scrollBarWidth
        }
    }

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
            <div className={styles.links}>
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => scrollTo(Slide.FOOD)}>Food</a>
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => scrollTo(Slide.RECIPE)}>Recipe</a>
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => scrollTo(Slide.MENU)}>Menu</a>
            </div>
            <div className={styles.scroll_bar} style={calculateScrollBarPosition()}></div>
           
        </nav>
    )
}

export default NavBar