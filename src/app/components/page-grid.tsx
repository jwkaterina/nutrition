'use client'

import styels from './page-grid.module.css'
import Card from '../components/card'

const PageGrid = ( { children }) => {
    return (
        <div className={styels.container}>
            <div className={styels.grid}>
                {children}
                <Card title={null} id={null} text={null} type={'add'} />
            </div>

        </div>
    );
}

export default PageGrid