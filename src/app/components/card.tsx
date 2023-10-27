'use client'

import styles from './card.module.css'

const Card = ({ title, id, text, type }) => {
    if(type === 'add') return (
        <div className={styles.card} key={id}>
            <div className={styles.add}>
                <div className={styles.add__icon}>+</div>
            </div>
        </div>
    )

    return (
        <div className={styles.card} key={id}>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    )
}

export default Card