'use client'

import styles from './card.module.css'
import { useRef, useContext, useEffect } from 'react'
import { CardOpenContext, SetCardOpenContext } from '@/app/context/card-context'

interface CardProps {
    title: string,
    text: {
        kcal: number | string,
        prot: number | string,
        fat: number | string,
        carb: number | string
    
    },
    index: number,
    imgUrl: string,
    measures: {
        uri: string
        label: string
        weight: number
    }[]
}

const Card = ({ title, text, index, imgUrl, measures }: CardProps): JSX.Element => {
    if(title.length >30) title = title.substring(0,30) + '...';

    const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
      }

    const cardOpen = useContext(CardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);

    const cardRef = useRef<HTMLDivElement>(null);

    const mediaQuery: MediaQueryList = window.matchMedia('(max-width: 600px)');

    const gridGap: number = 1;
    const cardHeight: number = 150;
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

    return (
        <div className={styles.card} onClick={() => {
            setCardOpen(index);
        }} ref={cardRef}>
            <div className={styles.title}>
                {isImage(imgUrl) && <img src={imgUrl} alt="" className={styles.img}/>}
                <h2>{title}</h2>
            </div>
            {cardOpen === index && <div className={styles.measures}>{
                    measures.map((measure) => {
                        return (
                            <p key={measure.uri}>{measure.label}</p>
                        )
                    })
                }</div>}
            <div className={styles.nutrients}>
                <div className={styles.column}>
                    <h5>kcal</h5>
                    <p>{text.kcal}</p>
                </div>
                <div className={styles.column}>
                    <h5>prot</h5>
                    <p>{text.prot}</p>
                </div>
                <div className={styles.column}>
                    <h5>fat</h5>
                    <p>{text.fat}</p>
                </div>
                <div className={styles.column}>
                    <h5>carb</h5>
                    <p>{text.carb}</p>
                </div>
            </div>
        </div>
    )
}

export default Card