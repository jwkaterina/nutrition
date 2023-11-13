'use client'

import styles from './nav-bar.module.css'
import { SlideType } from "@/app/types/types"

interface MainNavProps {
    slide: SlideType,
    setSlide: (slide: SlideType) => void,
    setBlockScrollHandler: (blockScrollHandler: boolean) => void,
}

const MainNav = ({ slide, setSlide, setBlockScrollHandler }: MainNavProps): JSX.Element => {
    const mediaQuery: MediaQueryList = window.matchMedia('(max-width: 600px)');

    let linkWidth: string;
    if(mediaQuery.matches) {
        linkWidth = '100px';
    } else {
        linkWidth = '200px';
    }
    const scrollBarWidth = '20vw';

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
            case SlideType.FOOD:
                position = position1;
                break;
            case SlideType.RECIPE:
                position = position2;
                break;
            case SlideType.MENU:
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
    
    const handleClick = (slide: SlideType): void => {
        setBlockScrollHandler(true);
        setSlide(slide);
        setTimeout(() => {
            setBlockScrollHandler(false);
        }, 500)
    }

    return <>
        <div className={styles.main_links}>
            <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.FOOD)}>My Food</a>
            <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.RECIPE)}>My Recipes</a>
            <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.MENU)}>My Menus</a>
        </div>
        <div className={styles.scroll_bar} style={calculateScrollBarPosition()}></div>
    </>
}

export default MainNav