'use client'

import styles from './slider.module.css'
import Food from '@/app/components/slides/food';
import Recipe from '@/app/components/slides/recipe';
import Menu from '@/app/components/slides/menu';
import { useEffect, useRef, useContext } from 'react';
import { SlideType } from '@/app/types/types';
import { CardOpenContext, ScrollContext, SetScrollContext } from '@/app/context/card-context';

interface SliderProps {
    slide: SlideType,
    setSlide: (slide: SlideType) => void,
    blockScrollHandler: boolean,
}

const Slider = ({ slide, setSlide, blockScrollHandler }: SliderProps): JSX.Element => {

    const slidesRef = useRef(null);
    const cardOpen = useContext(CardOpenContext);
	const scroll = useContext(ScrollContext);
	const setScroll = useContext(SetScrollContext);

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
			slidesRef.current.scrollTo(0, 0);
			setTimeout(() => {
				setScroll(true);
			}, 1000)
		} else {
			setScroll(false);
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
        <div className={styles.slides} ref={slidesRef} onScroll={handleScroll} style={scroll && cardOpen ? {overflow: 'hidden'} : {overflow: 'auto'}}>
            <Food/>
            <Recipe/>
            <Menu/>
      </div>
    )
}

export default Slider