'use client'

import styles from './slide.module.css'
import PageGrid from "../slider/page-grid"

interface SlideProps {
    children: React.ReactNode
}

const Slide = ({ children }: SlideProps): JSX.Element => {
    return (
        <div className={styles.container}>
        <PageGrid>
            {children}
        </PageGrid>
        </div>
    )
}

export default Slide

