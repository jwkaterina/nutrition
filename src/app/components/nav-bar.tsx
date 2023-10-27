'use client'

// import Link from "next/link"
import styles from "./nab-bar.module.css"
// import { usePathname} from 'next/navigation';
import { Slide } from "../page"
import { useEffect, useRef } from "react";


const NavBar = ({ slide, scrollTo }) => {

    // const pathname = usePathname();
    const navRef = useRef(null);
    const navBarWidth = useRef(0);

    const linkWidth = 100;

    // setTimeout(() => {
    //     navBarWidth.current = navRef.current.clientWidth;
    // }
    // , 0)

    const handleScrollBar = () => {
        if(!navRef.current) console.log("navRef.current is null");
        const spaceWidth = (navBarWidth.current - 3 * linkWidth) / 4;
        const scrollBarWidth = navBarWidth.current / 5;
        const position1 = spaceWidth + linkWidth / 2 - scrollBarWidth / 2;
        const position2 = 2 * spaceWidth + linkWidth / 2 * 3 - scrollBarWidth / 2;
        const position3 = 3 * spaceWidth + linkWidth / 2 * 5 - scrollBarWidth / 2;
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
        console.log(slide, position)
        return {
            left: `${position}px`,
            width: `${scrollBarWidth}px`
        }
    }

    return (
        <nav className={styles.container} ref={navRef}>
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
            <div className={styles.scroll_bar} style={handleScrollBar()}></div>
           
        </nav>
    )
}

export default NavBar