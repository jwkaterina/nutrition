'use client'

import styles from './slider.module.css'
import FoodSlide from '@/app/components/slider/slides/food-slide';
import RecipeSlide from '@/app/components/slider/slides/recipe-slide';
import MenuSlide from '@/app/components/slider/slides/menu-slide';
import { useEffect, useRef, useContext } from 'react';
import { SlideType } from '@/app/types/types';
import { CardOpenContext } from '@/app/context/card-context';
import { SlideContext, SetSlideContext, BlockScrollContext, ScrollBehaviorContext } from '../../context/slide-context';

interface SliderProps {
    foodDeleted: boolean,
    recipeDeleted: boolean,
    menuDeleted: boolean
}

const Slider = ({ foodDeleted, recipeDeleted, menuDeleted }: SliderProps): JSX.Element => {

    const slidesRef = useRef(null);
    const cardOpen = useContext(CardOpenContext);
    const slide = useContext(SlideContext);
    const setSlide = useContext(SetSlideContext);
    const blockScrollHandler = useContext(BlockScrollContext);
    const scrollBehavior = useContext(ScrollBehaviorContext);

    useEffect(() => {
		scrollTo(0, 0);
        if(!slidesRef.current) return;
        (slidesRef.current as HTMLElement).scrollTo({
          top: 0,
          left: (slidesRef.current as HTMLElement).clientWidth * slide,
          behavior: scrollBehavior,
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
            setSlide(SlideType.MENU)
        }
    }

    const style = () => {
        if(cardOpen) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div 
            className={styles.slides} 
            ref={slidesRef} 
            onScroll={handleScroll} 
            style={style()}
        >
            <FoodSlide foodDeleted={foodDeleted}/>
            <RecipeSlide recipeDeleted={recipeDeleted}/>
            <MenuSlide menuDeleted={menuDeleted}/>
      </div>
    )
}

export default Slider