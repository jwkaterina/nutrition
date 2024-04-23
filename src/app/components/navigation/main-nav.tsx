import { useContext } from 'react';
import { SlideContext } from '@/app/context/slide-context';
import { SlideType } from "@/app/types/types";
import styles from './nav-bar.module.css';

const MainNav = (): JSX.Element => {

    const { slide, setSlide, setBlockScroll } = useContext(SlideContext);

    let mediaQuery: MediaQueryList | null = null;
    if(typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(max-width: 500px)');
    }

    let linkWidth: string;
    if(mediaQuery && (mediaQuery as MediaQueryList).matches) linkWidth = '100px';
    linkWidth = '200px';

    const scrollBarWidth: string = '20vw';
    const spaceWidth: string = `calc((100vw - 3 * ${linkWidth}) / 4)`;
    const position1: string = `calc(${spaceWidth} + ${linkWidth} / 2 - ${scrollBarWidth} / 2)`;   
    const position2: string = `calc(2 * ${spaceWidth} + ${linkWidth} / 2 * 3 - ${scrollBarWidth} / 2)`;
    const position3: string = `calc(3 * ${spaceWidth} + ${linkWidth} / 2 * 5 - ${scrollBarWidth} / 2)`;

    
    const handleClick = (slide: SlideType): void => {
        setBlockScroll(true);
        setSlide(slide);
        setTimeout(() => {
            setBlockScroll(false);
        }, 500);
    }

    return (
        <>
            <div className={styles.main_links}>
                <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.FOOD)}>My Food</a>
                <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.RECIPE)}>My Recipes</a>
                <a className={styles.link} style={{width: `${linkWidth}`}} onClick={() => handleClick(SlideType.MENU)}>My Menus</a>
            </div>
            <div className={styles.scroll_bar} style={{
                width: scrollBarWidth, 
                left: slide === SlideType.FOOD
                    ? position1
                    : slide === SlideType.RECIPE
                    ? position2
                    : position3
            }}></div>
        </>
    );
}

export default MainNav;