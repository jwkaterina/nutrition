'use client'

import styles from './card.module.css'
import { useState, useRef } from 'react'

interface CardProps {
    title: string,
    text: string | number,
    index: number
}

const Card = ({ title, text, index }: CardProps): JSX.Element => {

    const [openCard, setOpenCard] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const mediaQuery: MediaQueryList = window.matchMedia('(max-width: 600px)');

    const cardHeight: number = cardRef.current ? cardRef.current.clientHeight : 0;
    const gridGap: number = 1;
    const headerHeight: number = 80;
    const footerHeight: number = 80;

    let column: number, row: number, translateX: number, height: number;
    if(mediaQuery.matches) {
        column = index % 2 === 0 ? 2 : index % 2;
        row = Math.ceil(index / 2);
        translateX = (1 - column) * 50;
        height = window.innerHeight - headerHeight - footerHeight;
    } else {
        column = index % 4 === 0 ? 4 : index % 4;
        row = Math.ceil(index / 4);
        translateX = (1 - column) * 25;
        height = window.innerHeight - headerHeight;
    }
    const translateY: number = (1 - row) * cardHeight;
    const top: number = - gridGap * row;

    const keyframes: Keyframe[] = [
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1 },
        { top: `${top}rem`, left: `-${gridGap}rem`, width: '100vw', height: `${height}px`, zIndex: 1, transform: `translate(${translateX}%, ${translateY}px)`},
    ];

    const options: KeyframeAnimationOptions  = {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    };

    if(cardRef.current && openCard) {
        cardRef.current.animate(keyframes, options);
        document.body.style.overflow = 'hidden';
    }

    return (
        <div className={styles.card} onClick={() => setOpenCard(true)} ref={cardRef}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card