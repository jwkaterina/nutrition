'use client'

import { useEffect } from 'react';
import styles from './page-grid.module.css'
import { CardOpenContext } from '@/app/context/card-context';

interface PageGridProps {
    children: React.ReactNode
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    const cardOpen = CardOpenContext;

    useEffect(() => {
        scrollTo(0, 0);
        console.log('scrolling to top');
    }, [cardOpen])

    return (
            <div className={styles.grid}>
                {children}
            </div>
    )
}

export default PageGrid