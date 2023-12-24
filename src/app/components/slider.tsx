'use client'

import styles from './slider.module.css'
import Food from '@/app/components/slides/food';
import Recipe from '@/app/components/slides/recipe';
import Menu from '@/app/components/slides/menu';
import { useEffect, useRef, useContext } from 'react';
import { SlideType } from '@/app/types/types';
import { CardOpenContext } from '@/app/context/card-context';
import { SlideContext, SetSlideContext, BlockScrollContext } from '../context/slide-context';

interface SliderProps {
}

const Slider = ({ }: SliderProps): JSX.Element => {

    const slidesRef = useRef(null);
    const cardOpen = useContext(CardOpenContext);
    const slide = useContext(SlideContext);
    const setSlide = useContext(SetSlideContext);
    const blockScrollHandler = useContext(BlockScrollContext);

    useEffect(() => {
		scrollTo(0, 0);
        if(!slidesRef.current) return;
        (slidesRef.current as HTMLElement).scrollTo({
          top: 0,
          left: (slidesRef.current as HTMLElement).clientWidth * slide,
          behavior: "smooth",
        });
      }, [slide]);

	useEffect(() => {
		if(!slidesRef.current) return;
		if(cardOpen) {
            scrollTo(0, 0);
			(slidesRef.current as HTMLElement).scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
		}
	}, [cardOpen])

    const handleScroll = () => {
      if(blockScrollHandler || !slidesRef.current) return;
        const scrollLeft = (slidesRef.current as HTMLElement).scrollLeft;
        const width = (slidesRef.current as HTMLElement).clientWidth;
        if(scrollLeft - 5 <= 0 && slide != SlideType.FOOD) {
            setSlide(SlideType.FOOD)
        } else if(scrollLeft + 5 >= width && scrollLeft - 5 <= width  && slide != SlideType.RECIPE) {
            setSlide(SlideType.RECIPE)
        } else if(scrollLeft + 5 >= 2 * width && slide != SlideType.MENU) {
            // setTimeout(() => {
            setSlide(SlideType.MENU)
        }
    }

    return (
        <div className={styles.slides} ref={slidesRef} onScroll={handleScroll} style={cardOpen ? {overflow: 'hidden'} : {overflow: 'auto'}}>
            <Food/>
            <Recipe/>
            <Menu/>
      </div>
    )
}

export default Slider