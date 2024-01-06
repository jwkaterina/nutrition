'use client'

import styles from './card.module.css'
import { useRef, useContext, useEffect } from 'react'
import { CardOpenContext, SetCardOpenContext } from '@/app/context/card-context'
import { SetCurrentFoodContext } from '@/app/context/food-context'
import { Food } from '@/app/types/types'

interface CardProps {
    index: number,
    food: Food,
    children: React.ReactNode
}

const Card = ({ index, children, food }: CardProps): JSX.Element => {

    const cardOpen = useContext(CardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const setCurrentFood = useContext(SetCurrentFoodContext);
    const cardRef = useRef<HTMLDivElement>(null);

    let mediaQuery600: MediaQueryList | null = null;
    let mediaQuery1000: MediaQueryList | null = null;
    let height = 0;
    if(typeof window !== 'undefined') {
        height = window.innerHeight;
        mediaQuery600 = window.matchMedia('(max-width: 500px)');
        mediaQuery1000 = window.matchMedia('(max-width: 1000px)');
    }

    const gridGap: number = 1;
    const cardHeight: number = 150;
    const cardWidth: number = cardRef.current ? cardRef.current.clientWidth : 0;

    let column: number, row: number;
    if(mediaQuery600 && (mediaQuery600 as MediaQueryList).matches) {
        column = 1;
        row = Math.ceil(index);
    } else if(mediaQuery1000 && (mediaQuery1000 as MediaQueryList).matches) {
        column = index % 2 === 0 ? 2 : 1;
        row = Math.ceil(index / 2);
    } else {
        column = index % 4 === 0 ? 4 : index % 4;
        row = Math.ceil(index / 4);
    }

    const translateX = (1 - column) * cardWidth;
    const translateY: number = (1 - row) * cardHeight;
    const top: number = - gridGap * row;
    const left: number = - gridGap * column;

    const keyframes: Keyframe[] = [
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1 },
        { top: `${top}rem`, left: `${left}rem`, width: '100vw', height: `${height}px`, zIndex: 2, transform: `translate(${translateX}px, ${translateY}px)`},
    ];

    const keyframesReverse: Keyframe[] = [
        { top: `${top}rem`, left: `${left}rem`, width: '100vw', height: `${height}px`, zIndex: 2, transform: `translate(${translateX}px, ${translateY}px)`},
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1, transform: `translate(0px, 0px)` }
    ];

    const options: KeyframeAnimationOptions  = {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    };

    if(cardRef.current && cardOpen === index) {
        cardRef.current.animate(keyframes, options);
    } 

    useEffect(() => {
        if(cardOpen === 0) {
            cardRef.current?.animate(keyframesReverse, options);
        }
    }, [cardOpen])

    const handleCardClick = () => {
        setCardOpen(index); 
        setCurrentFood(food);
        console.log(food);
    }

    return (
        <div className={cardOpen != index ? styles.card : `${styles.card} ${styles.card_open}`} onClick={handleCardClick} ref={cardRef}>
            {children}
        </div>
    )
}

export default Card