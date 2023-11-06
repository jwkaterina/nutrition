'use client'

import Link from 'next/link'
import styles from './page-grid.module.css'
import cardStyles from './card.module.css'

interface PageGridProps {
    search: string,
    children: JSX.Element[]
}

const PageGrid = ( { search, children }: PageGridProps): JSX.Element => {

    const mediaQuery = window.matchMedia('(max-width: 600px)'); 

    const Button = () => {
        return (
            <div className={cardStyles.card}>
                <Link href={`/${search}`} className={styles.link}>
                    <div className={styles.add__icon}>+</div>
                </Link> 
            </div>
        )
    }

    // const MobileButton = () => {
    //     return (
    //         <button className={styles.button}>
    //             <Link href={`/${search}`} className={styles.mobile_link}>+</Link>
    //         </button>
    //     )
    // }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {children}
                <Button />
            </div>
            {/* {mediaQuery.matches && <MobileButton />} */}
        </div>
    )
}

export default PageGrid