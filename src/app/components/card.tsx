'use client'

import styles from './card.module.css'

interface CardProps {
    title: string | null,
    text: string | null,
    type?: string
}

const Card = ({ title, text, type }: CardProps): JSX.Element => {
    if(type === 'add') return (
        <div className={styles.card}>
            <div className={styles.add}>
                <div className={styles.add__icon}>+</div>
            </div>
        </div>
    )

    return (
        <div className={styles.card}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card