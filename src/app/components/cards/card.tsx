import { useRef, useContext, useEffect, useState } from 'react';
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';
import styles from './card.module.css';

interface CardProps {
    index: number,
    children: React.ReactNode,
    onCardClick: () => void,
    setIsOpen: (isOpen: boolean) => void,
    isOpen: boolean
}

const Card = ({ index, children, onCardClick, setIsOpen, isOpen }: CardProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const [style, setStyle] = useState({} as React.CSSProperties);
    const cardRef = useRef<HTMLDivElement>(null);

    let mediaQuery500: MediaQueryList | null = null;
    let mediaQuery1000: MediaQueryList | null = null;
    if(typeof window !== 'undefined') {
        mediaQuery500 = window.matchMedia('(max-width: 500px)');
        mediaQuery1000 = window.matchMedia('(max-width: 1000px)');
    }

    const headerHeight: number = 60;
    const gridGap: number = 1;
    const cardHeight: number = 150;
    const cardWidth: number = cardRef.current ? cardRef.current.clientWidth : 0;

    let column: number, row: number;
    if(mediaQuery500 && (mediaQuery500 as MediaQueryList).matches) {
        column = 1;
        row = Math.ceil(index);
    } else if(mediaQuery1000 && (mediaQuery1000 as MediaQueryList).matches) {
        column = index % 2 === 0 ? 2 : 1;
        row = Math.ceil(index / 2);
    } else {
        column = index % 4 === 0 ? 4 : index % 4;
        row = Math.ceil(index / 4);
    }

    const translateX: number = (1 - column) * cardWidth;
    const translateY: number = (1 - row) * cardHeight;
    const top: number = - gridGap * row;
    const left: number = - gridGap * column;

    const keyframes: Keyframe[] = [
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1 },
        { top: `${top}rem`, left: `${left}rem`, width: '100vw', height: `calc(100vh - 2 * ${headerHeight}px)`, zIndex: 2, transform: `translate(${translateX}px, ${translateY}px)`},
    ];

    const keyframesReverse: Keyframe[] = [
        { top: `${-gridGap}rem`, left: `${-gridGap}rem`, width: '100vw', height: `calc(100vh - 2 * ${headerHeight}px)`, zIndex: 2},
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1, transform: `translate(0px, 0px)` }
    ];

    const animationDuration = 300;

    const animationOptions: KeyframeAnimationOptions  = {
        duration: animationDuration,
        easing: 'ease-in-out',
        fill: 'forwards'
    };

    const styleOptions: KeyframeAnimationOptions  = {
        duration: 0,
        fill: 'forwards'
    };
   
    useEffect(() => {
        if(!isOpen) {
            setStyle({cursor: 'pointer'});
            return;
        }
        if(cardOpen == CardState.OPEN) {
            setStyle({
                height: '100%',
                width: '100vw'
            })
        }
        if(cardRef.current && cardOpen == CardState.OPENING) {
            cardRef.current.animate(keyframes, animationOptions);
            setTimeout(() => {
                setCardOpen(CardState.OPEN);
            }, animationDuration);
        } 
        if(cardOpen == CardState.CLOSING) {
            cardRef.current?.animate(keyframesReverse, animationOptions);
            setIsOpen(false);
            setTimeout(() => {
                setCardOpen(CardState.CLOSED);
            }, animationDuration);
        }
        if(cardOpen == CardState.CLOSED) {
            cardRef.current?.animate(keyframesReverse, styleOptions);
            setIsOpen(false);
        }
    }, [cardOpen, isOpen]);

    return (
        <div className={styles.card} onClick={onCardClick} ref={cardRef} style={style}>
            {children}
        </div>
    );
}

export default Card;