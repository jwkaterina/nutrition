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

    const gridGap: number = 1;
    const headerHeight: number = 80;
    const footerHeight: number = 80;

    const cardHeight: number = cardRef.current ? cardRef.current.clientHeight : 0;
    const cardWidth: number = cardRef.current ? cardRef.current.clientWidth : 0;

    let column: number, row: number;
    if(mediaQuery.matches) {
        column = index % 2 === 0 ? 2 : index % 2;
        row = Math.ceil(index / 2);
    } else {
        column = index % 4 === 0 ? 4 : index % 4;
        row = Math.ceil(index / 4);
    }

    const height = window.innerHeight;
    const translateX = (1 - column) * cardWidth;
    const translateY: number = (1 - row) * cardHeight;
    const top: number = - gridGap * row;
    const left: number = - gridGap * column;


    const keyframes: Keyframe[] = [
        { top: 0, left: 0, width: '100%', height: `${cardHeight}px`, zIndex: 1 },
        { top: `${top}rem`, left: `${left}rem`, width: '100vw', height: `${height}px`, zIndex: 1, transform: `translate(${translateX}px, ${translateY}px)`},
    ];

    const options: KeyframeAnimationOptions  = {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    };

    if(cardRef.current && openCard) {
        cardRef.current.animate(keyframes, options);
    }

    return (
        <div className={styles.card} onClick={() => setOpenCard(true)} ref={cardRef}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card