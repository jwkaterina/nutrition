'use client'

import styels from './page-grid.module.css'
import Card from './card'

const PageGrid = ( { children }) => {

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