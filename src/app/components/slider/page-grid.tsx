import styles from './slider.module.css';

interface PageGridProps {
    children: React.ReactNode;
    compact?: boolean;
}

const PageGrid = ({ children, compact }: PageGridProps): JSX.Element => {

    return (
        <div className={styles.grid} style={compact ? { paddingTop: '1rem' } : undefined}>
            {children}
        </div>
    );
}

export default PageGrid;