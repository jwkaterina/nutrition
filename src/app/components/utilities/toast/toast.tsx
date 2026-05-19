'use client';
import { useEffect, useContext, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { StatusContext } from '@/app/context/status-context';
import { StatusType } from '@/app/types/types';
import styles from './toast.module.css';

const Toast = () => {

    const { message, setMessage, status } = useContext(StatusContext);
    const [open, setOpen] = useState(false);
    const timers = useRef<NodeJS.Timeout[]>([]);

    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };

    useEffect(() => {
        if (!message) return;
        clearTimers();
        setOpen(true);
        timers.current.push(
            setTimeout(() => setOpen(false), 4000),
            setTimeout(() => setMessage(null), 4500)
        );
        return clearTimers;
    }, [message, status]);

    const onClose = () => {
        clearTimers();
        setOpen(false);
        setTimeout(() => setMessage(null), 500);
    };

    const isSuccess = status === StatusType.SUCCESS;
    const toastClass = [
        styles.toast,
        open ? styles.active : '',
        isSuccess ? styles.success : styles.error
    ].join(' ');

    return (
        <div className={toastClass}>
            <div className={styles.toast_content}>
                <FontAwesomeIcon
                    icon={isSuccess ? faCircleCheck : faCircleExclamation}
                    className={isSuccess ? styles.check : styles.fail}
                />
                <div className={styles.info}>
                    <span className={styles.status_label}>{status}</span>
                    <span className={styles.message}>{message}</span>
                </div>
            </div>
            <FontAwesomeIcon icon={faXmark} className={styles.close} onClick={onClose} />
            <div key={`${message}-${status}`} className={styles.progress} />
        </div>
    );
}

export default Toast;
