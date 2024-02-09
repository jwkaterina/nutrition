import styles from './toast.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
    active: boolean;
    message: string | null;
    clearMessage: () => void;
    status: 'Success' | 'Error';
}

const Toast = ({ active,  message, clearMessage, status }: ToastProps) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (active) {
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 4000);
            setTimeout(() => {
                clearMessage();
            }, 4500);
        }
    }, [active]);

    const onClose = () => {
        setOpen(false);
        setTimeout(() => {
            clearMessage();
        }, 500);
    }

    return (<>
        <div className={open ? `${styles.toast} ${styles.active}` : `${styles.toast}`}>
            <div className={styles.toast_content}>
                {status == 'Success' ? 
                    <FontAwesomeIcon icon={faCircleCheck} className={styles.check}/> :
                    <FontAwesomeIcon icon={faCircleExclamation} className={styles.fail}/>
                }
                <div className={styles.info}>
                    <span className={`${styles.text} ${styles.status}`}>{status}</span>
                    <span className={`${styles.text} ${styles.message}`}>{message}</span>
                </div>
            </div>
            <FontAwesomeIcon icon={faXmark} className={styles.close} onClick={onClose}/>
            <div className={open ? `${styles.progress} ${styles.active}` : `${styles.progress}`}></div>
        </div>
    </>)
}

export default Toast;