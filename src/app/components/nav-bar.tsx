'use client'

// import Link from "next/link"
import styles from "./nab-bar.module.css"
// import { usePathname} from 'next/navigation';
import { Slide } from "../page"

interface NavBarProps {
    slide: Slide,
    setSlide: (slide: Slide) => void,
    setBlockScrollHandler: (blockScrollHandler: boolean) => void
}

const NavBar = ({ slide, setSlide, setBlockScrollHandler }: NavBarProps): JSX.Element => {

    // const pathname = usePathname();

    const linkWidth: string = '100px';
    const scrollBarWidth: string = '20vw';

    type ScrollBarPosition = {
        left: string,
        width: string
    }

    const calculateScrollBarPosition = (): ScrollBarPosition  => {
        const spaceWidth: string = `(100vw - 3 * ${linkWidth}) / 4`;
        const position1: string = `calc(${spaceWidth} + ${linkWidth} / 2 - ${scrollBarWidth} / 2)`;   
        const position2: string = `calc(2 * ${spaceWidth} + ${linkWidth} / 2 * 3 - ${scrollBarWidth} / 2)`;
        const position3: string = `calc(3 * ${spaceWidth} + ${linkWidth} / 2 * 5 - ${scrollBarWidth} / 2)`;
        let position: string;
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

    const handleClick = (slide: Slide): void => {
        setBlockScrollHandler(true);
        setSlide(slide);
        setTimeout(() => {
            setBlockScrollHandler(false);
        }, 500)
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
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => handleClick(Slide.FOOD)}>My Food</a>
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => handleClick(Slide.RECIPE)}>My Recipes</a>
                <a className={styles.link} style={{width: `${linkWidth}px`}} onClick={() => handleClick(Slide.MENU)}>My Menus</a>
            </div>
            <div className={styles.scroll_bar} style={calculateScrollBarPosition()}></div>
           
        </nav>
    )
}

export default NavBar