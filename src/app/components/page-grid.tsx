'use client'

import styles from './page-grid.module.css'
import cardStyles from './card.module.css'

interface PageGridProps {
    children: JSX.Element[]
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    const mediaQuery = window.matchMedia('(max-width: 600px)'); 

    const Button = () => {
        return (
            <div className={cardStyles.card}>
                <div className={styles.add}>
                    <div className={styles.add__icon}>+</div>
                </div>
            </div>
        )
    }

    const MobileButton = () => {
        return (
            <button className={styles.button}>+</button>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {children}
                {mediaQuery.matches ? <MobileButton /> : <Button />}
            </div>
        </div>
    )
}

export default PageGrid