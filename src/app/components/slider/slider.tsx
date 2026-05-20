'use client';
import { useRef, useContext, useCallback, useEffect, useLayoutEffect } from 'react';
import FoodSlide from '@/app/components/slider/slides/food-slide';
import RecipeSlide from '@/app/components/slider/slides/recipe-slide';
import MenuSlide from '@/app/components/slider/slides/menu-slide';
import { CardOpenContext } from '@/app/context/card-context';
import { SlideContext } from '../../context/slide-context';
import { SlideType, CardState } from '@/app/types/types';
import styles from './slider.module.css';

interface SliderProps {
    foodDeleted: boolean
}

const Slider = ({ foodDeleted }: SliderProps): JSX.Element => {

    const slidesRef = useRef<HTMLDivElement | null>(null);
    const { cardOpen } = useContext(CardOpenContext);
    const { slide, setSlide, blockScroll, scrollBehavior, setScrollRatio } = useContext(SlideContext);

    const scrollToSlide = useCallback((targetSlide: number, animated: boolean) => {
        const container = slidesRef.current;
        if (!container) return;
        container.scrollTo({
            left: container.clientWidth * targetSlide,
            behavior: animated ? 'smooth' : 'instant',
        });
    }, []);

    // Restore slide from URL before first paint so the underline and scroll
    // position are correct immediately, with no visible jump or animation.
    useLayoutEffect(() => {
        const tab = new URLSearchParams(window.location.search).get('tab');
        if (tab === 'recipe') { setSlide(SlideType.RECIPE); setScrollRatio(SlideType.RECIPE); scrollToSlide(SlideType.RECIPE, false); }
        else if (tab === 'menu') { setSlide(SlideType.MENU); setScrollRatio(SlideType.MENU); scrollToSlide(SlideType.MENU, false); }
        else if (tab === 'food') { setSlide(SlideType.FOOD); setScrollRatio(SlideType.FOOD); scrollToSlide(SlideType.FOOD, false); }
    }, []);

    // Keep URL in sync with active slide (no history entry)
    useEffect(() => {
        const names = { [SlideType.FOOD]: 'food', [SlideType.RECIPE]: 'recipe', [SlideType.MENU]: 'menu' };
        window.history.replaceState(window.history.state, '', `/?tab=${names[slide]}`);
    }, [slide]);

    useEffect(() => {
        scrollToSlide(slide, scrollBehavior === 'smooth');
    }, [slide, scrollBehavior]);

    useEffect(() => {
        if (cardOpen === CardState.OPENING) scrollToSlide(slide, false);
    }, [cardOpen]);

    const handleScroll = () => {
        if (!slidesRef.current) return;
        const { scrollLeft, clientWidth } = slidesRef.current;
        setScrollRatio(Math.min(2, Math.max(0, scrollLeft / clientWidth)));
        if (blockScroll) return;
        if (scrollLeft - 5 <= 0 && slide !== SlideType.FOOD) {
            setSlide(SlideType.FOOD);
        } else if (scrollLeft + 5 >= clientWidth && scrollLeft - 5 <= clientWidth && slide !== SlideType.RECIPE) {
            setSlide(SlideType.RECIPE);
        } else if (scrollLeft + 5 >= 2 * clientWidth && slide !== SlideType.MENU) {
            setSlide(SlideType.MENU);
        }
    };

    return (
        <div
            className={styles.container}
            ref={slidesRef}
            onScroll={handleScroll}
            style={cardOpen === CardState.OPEN ? { overflow: 'hidden' } : undefined}
        >
            <FoodSlide foodDeleted={foodDeleted} />
            <RecipeSlide />
            <MenuSlide />
        </div>
    );
}

export default Slider;
