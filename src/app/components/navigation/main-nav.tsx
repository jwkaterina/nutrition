import { useContext } from 'react';
import { SlideContext } from '@/app/context/slide-context';
import { SlideType } from "@/app/types/types";
import styles from './nav-bar.module.css';

const MainNav = (): JSX.Element => {

    const { slide, setSlide, setBlockScroll, scrollRatio } = useContext(SlideContext);

    // All sizes in CSS units — no window access, so SSR and client produce identical HTML.
    // pos1 = center of first tab minus half bar width; step = distance between tab centers.
    const sw = '(100vw - 600px) / 4';
    const left = `calc((${sw}) + 100px - 10vw + ${scrollRatio} * ((${sw}) + 200px))`;

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
                <a className={styles.link} style={{width: '200px'}} onClick={() => handleClick(SlideType.FOOD)}>My Food</a>
                <a className={styles.link} style={{width: '200px'}} onClick={() => handleClick(SlideType.RECIPE)}>My Recipes</a>
                <a className={styles.link} style={{width: '200px'}} onClick={() => handleClick(SlideType.MENU)}>My Menus</a>
            </div>
            <div className={styles.scroll_bar} style={{
                width: '20vw',
                left
            }}></div>
        </>
    );
}

export default MainNav;