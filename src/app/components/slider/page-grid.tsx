import styles from './slider.module.css';

interface PageGridProps {
    children: React.ReactNode
}

const PageGrid = ( { children }: PageGridProps): JSX.Element => {

    return (
        <div className={styles.grid}>
            {children}
        </div>
    );
}

export default PageGrid;