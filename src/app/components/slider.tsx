'use client'

import styles from './slider.module.css'
import Food from '@/app/components/slides/food';
import Recipe from '@/app/components/slides/recipe';
import Menu from '@/app/components/slides/menu';
import { useEffect, useRef, useContext } from 'react';
import { Slide } from '../page';
import { CardOpenContext } from '@/app/context/context';

interface SliderProps {
    slide: Slide,
    setSlide: (slide: Slide) => void,
    blockScrollHandler: boolean,
}

const Slider = ({ slide, setSlide, blockScrollHandler }: SliderProps): JSX.Element => {

    const slidesRef = useRef(null);
    const cardOpen = useContext(CardOpenContext);

    useEffect(() => {
        if(!slidesRef.current) return;
        (slidesRef.current as HTMLElement).scrollTo({
          top: 0,
          left: (slidesRef.current as HTMLElement).clientWidth * slide,
          behavior: "smooth",
        });
      }, [slide]);

    const handleScroll = () => {
      if(blockScrollHandler || !slidesRef.current) return;
        const scrollLeft = (slidesRef.current as HTMLElement).scrollLeft;
        const width = (slidesRef.current as HTMLElement).clientWidth;
        if(scrollLeft - 5 <= 0 && slide != Slide.FOOD) {
            setSlide(Slide.FOOD)
        } else if(scrollLeft + 5 >= width && scrollLeft - 5 <= width  && slide != Slide.RECIPE) {
            setSlide(Slide.RECIPE)
        } else if(scrollLeft + 5 >= 2 * width && slide != Slide.MENU) {
            // setTimeout(() => {
            setSlide(Slide.MENU)
        }
    }

    if(cardOpen && slidesRef.current) {
      (slidesRef.current as HTMLElement).style.overflow = 'hidden';
    }

    return (
        <div className={styles.slides} ref={slidesRef} onScroll={handleScroll}>
            <Food/>
            <Recipe/>
            <Menu/>
      </div>
    )
}

export default Slider