
import { useEffect, useRef, useContext } from 'react';
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
    const { slide, setSlide, blockScroll, scrollBehavior } = useContext(SlideContext);

    useEffect(() => {
		scrollTo(0, 0);
        if (slidesRef.current) {
            slidesRef.current.scrollTo({
                top: 0,
                left: slidesRef.current.clientWidth * slide,
                behavior: scrollBehavior
            });
        }
      }, [slide]);

	useEffect(() => {
		if(slidesRef.current && cardOpen == CardState.OPENING) {
			slidesRef.current.scrollTo({
                top: 0,
                left: slidesRef.current.clientWidth * slide,
                behavior: "auto",
            });
		}
	}, [cardOpen]);

    const handleScroll = () => {
        if(blockScroll || !slidesRef.current) return;
        const scrollLeft = slidesRef.current.scrollLeft;
        const width = slidesRef.current.clientWidth;
        if(scrollLeft - 5 <= 0 && slide != SlideType.FOOD) {
            setSlide(SlideType.FOOD)
        } else if(scrollLeft + 5 >= width && scrollLeft - 5 <= width  && slide != SlideType.RECIPE) {
            setSlide(SlideType.RECIPE)
        } else if(scrollLeft + 5 >= 2 * width && slide != SlideType.MENU) {
            setSlide(SlideType.MENU)
        }
    }

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'};
        } else {
            return {overflow: 'auto'};
        }
    }

    return (
        <div 
            className={styles.container} 
            ref={slidesRef} 
            onScroll={handleScroll} 
            style={style()}
        >
            <FoodSlide foodDeleted={foodDeleted}/>
            <RecipeSlide />
            <MenuSlide />
      </div>
    );
}

export default Slider;