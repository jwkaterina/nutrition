import styles from './toast.module.css';
import { useEffect, useState } from 'react';

interface ToastProps {
    active: boolean;
    message: string | null;
    clearError: () => void;
    status: 'Success' | 'Error';
}

const Toast = ({ active,  message, clearError, status }: ToastProps) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (active) {
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000)
        }
    }, [active]);

    const onClose = () => {
        setOpen(false);
        clearError();
    }

    return (<>
        <div className={open ? `${styles.toast} ${styles.active}` : `${styles.toast}`}>
            <div className={styles.toast_content}>
                {/* <i className={styles.fas fa_solid fa_check check}></i> */}
                <div className={styles.message}>
                    <span className={`${styles.text} ${styles.status}`}>{status}</span>
                    <span className={`${styles.text} ${styles.message}`}>{message}</span>
                </div>
            </div>
                {/* <i className={styles.fa_solid fa-xmark close} onClick={onClose}></i> */}
            <div className={open ? `${styles.progress} ${styles.active}` : `${styles.progress}`}></div>
        </div>
    </>)
}

export default Toast;