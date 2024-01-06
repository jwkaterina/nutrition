import styles from './overlay.module.css';

interface OverlayProps {
    children: JSX.Element
}

const Overlay = ({ children }: OverlayProps): JSX.Element => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
}

export default Overlay;