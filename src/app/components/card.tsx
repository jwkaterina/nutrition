'use client'

import styles from './card.module.css'
import { useState, useRef } from 'react'

interface CardProps {
    title: string | null,
    text: string | number | null,
    type: string,
    index?: number
}

const Card = ({ title, text, type, index }: CardProps): JSX.Element => {

    const [openCard, setOpenCard] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement>();

    const column: number = index % 4 === 0 ? 4 : index % 4;
    const row: number = Math.ceil(index / 4);
    const translateX: number = (1 - column) * 25;
    const translateY: number = (1 - row) * 150;
    const top: number = - row;

    const keyframes: Keyframe[] = [
        { top: 0, left: 0, width: '100%', height: '150px', zIndex: 1 },
        { top: `${top}rem`, left: '-1rem', width: '100vw', height: '100vh', zIndex: 1, transform: `translate(${translateX}%, ${translateY}px)`},
    ];

    const options: KeyframeAnimationOptions  = {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    };

    if(openCard) {
        cardRef.current!.animate(keyframes, options);
        console.log('animate', index, column, row);
    }

    if(type === 'add') return (
        <div className={styles.card}>
            <div className={styles.add}>
                <div className={styles.add__icon}>+</div>
            </div>
        </div>
    )

    return (
        <div className={styles.card} onClick={() => setOpenCard(true)} ref={cardRef}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card