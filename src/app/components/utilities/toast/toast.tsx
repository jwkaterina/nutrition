'use client';
import { useEffect, useContext, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { StatusContext } from '@/app/context/status-context';
import { StatusType } from '@/app/types/types';
import styles from './toast.module.css';

const Toast = () => {

    const { message, setMessage, status, action, setAction } = useContext(StatusContext);
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
        const visibleMs = action ? 10000 : 4000;
        timers.current.push(
            setTimeout(() => setOpen(false), visibleMs),
            setTimeout(() => setMessage(null), visibleMs + 500)
        );
        return clearTimers;
    }, [message, status, action]);

    const onClose = () => {
        clearTimers();
        setOpen(false);
        setTimeout(() => {
            setMessage(null);
            setAction(null);
        }, 500);
    };

    const onActionClick = () => {
        if (!action) return;
        clearTimers();
        action.onClick();
        setOpen(false);
        setTimeout(() => {
            setMessage(null);
            setAction(null);
        }, 500);
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
            {action && (
                <button type="button" className={styles.action} onClick={onActionClick}>
                    {action.label}
                </button>
            )}
            <FontAwesomeIcon icon={faXmark} className={styles.close} onClick={onClose} />
            <div key={`${message}-${status}-${action?.label || ''}`} className={`${styles.progress} ${action ? styles.progress_long : ''}`} />
        </div>
    );
}

export default Toast;
