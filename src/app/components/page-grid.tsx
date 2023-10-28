'use client'

import styels from './page-grid.module.css'
import Card from './card'

interface PageGridProps {
    children: JSX.Element[]
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    const mediaQuery = window.matchMedia('(max-width: 600px)');

    return (
        <div className={styels.container}>
            <div className={styels.grid}>
                {children}
                {!mediaQuery.matches && <Card title={null} text={null} type={'add'} />}
            </div>

        </div>
    );
}

export default PageGrid