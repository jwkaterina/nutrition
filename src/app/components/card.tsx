'use client'

import styles from './card.module.css'

const Card = ({ title, text, type }) => {
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