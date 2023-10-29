'use client'

import styles from './card.module.css'
import { useState } from 'react'

interface CardProps {
    title: string | null,
    text: string | number | null,
    type: string,
    index?: number
}

const Card = ({ title, text, type, index }: CardProps): JSX.Element => {

    const [openCard, setOpenCard] = useState<boolean>(false);

    const calculateCardClassName = (): string => {
        let className: string = styles.card;
        if(openCard && index == 0) className += ' ' + styles.expand0;
        if(openCard && index == 1) className += ' ' + styles.expand1;
        if(openCard && index == 2) className += ' ' + styles.expand2;
        if(openCard && index == 3) className += ' ' + styles.expand3;
        if(openCard && index == 4) className += ' ' + styles.expand4;
        return className;
    }

    if(type === 'add') return (
        <div className={styles.card}>
            <div className={styles.add}>
                <div className={styles.add__icon}>+</div>
            </div>
        </div>
    )

    return (
        <div className={calculateCardClassName()} onClick={() => {
            setOpenCard(true);
            console.log(index);
        }}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card