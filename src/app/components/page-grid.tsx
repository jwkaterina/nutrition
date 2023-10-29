'use client'

import styles from './page-grid.module.css'
import Card from './card'

interface PageGridProps {
    children: JSX.Element[]
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    const mediaQuery = window.matchMedia('(max-width: 600px)'); 

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {children}
                {!mediaQuery.matches && <Card title={null} text={null} type={'add'} />}
            </div>
        </div>
    )
}

export default PageGrid