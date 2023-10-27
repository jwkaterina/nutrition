'use client'

import styles from './slider.module.css'
import Food from '@/app/components/slides/food';
import Recipe from '@/app/components/slides/recipe';
import Menu from '@/app/components/slides/menu';
import { useEffect, useRef } from 'react';

const Slider = ({ slide}) => {

    const slidesRef = useRef(null);

    useEffect(() => {
        if(!slidesRef.current) return;
        slidesRef.current.scrollTo({
          top: 0,
          left: slidesRef.current.clientWidth * slide,
          behavior: "smooth",
        });
      }, [slide]);

    return (
        <div className={styles.slides} ref={slidesRef}>
            <Food/>
            <Recipe/>
            <Menu />
      </div>
    )
}

export default Slider