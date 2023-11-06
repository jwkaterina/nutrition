'use client'

import styles from './page-grid.module.css'

interface PageGridProps {
    children: React.ReactNode
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    const mediaQuery = window.matchMedia('(max-width: 600px)'); 


    return (
            <div className={styles.grid}>
                {children}
            </div>
    )
}

export default PageGrid