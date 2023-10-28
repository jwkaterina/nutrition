'use client'

import styles from './slider.module.css'
import Food from '@/app/components/slides/food';
import Recipe from '@/app/components/slides/recipe';
import Menu from '@/app/components/slides/menu';
import { useState, useEffect, useRef } from 'react';
import { Slide } from '../page';

const Slider = ({ slide, setSlide, blockScrollHandler }) => {

    const slidesRef = useRef(null);

    useEffect(() => {
        if(!slidesRef.current) return;
        slidesRef.current.scrollTo({
          top: 0,
          left: slidesRef.current.clientWidth * slide,
          behavior: "smooth",
        });
      }, [slide]);

    const handleScroll = () => {
      if(blockScrollHandler || !slidesRef.current) return;
        const scrollLeft = slidesRef.current.scrollLeft;
        const width = slidesRef.current.clientWidth;
        if(scrollLeft - 5 <= 0 && slide != Slide.FOOD) {
            setSlide(Slide.FOOD)
        } else if(scrollLeft + 5 >= width && scrollLeft - 5 <= width  && slide != Slide.RECIPE) {
            setSlide(Slide.RECIPE)
        } else if(scrollLeft + 5 >= 2 * width && slide != Slide.MENU) {
            // setTimeout(() => {
            setSlide(Slide.MENU)
        }
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