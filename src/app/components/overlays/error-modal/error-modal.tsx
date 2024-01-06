import Overlay from '../overlay';
import styles from './error-modal.module.css';

interface ErrorModalProps {
    error: string,
    onClose: () => void
}

const ErrorModal = ({ error, onClose }: ErrorModalProps): JSX.Element => {
    return (
        <Overlay>
            <div className={styles.container}>
                <div className={styles.title}>An Error Occurred!</div>
                <div className={styles.message}>{error}</div>
                <button onClick={onClose}>Okay</button>
            </div>
        </Overlay>
    );
}

export default ErrorModal;