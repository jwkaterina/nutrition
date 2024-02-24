import styles from './toast.module.css';
import { useEffect, useContext,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { StatusContext } from '@/app/context/status-context';
import { StatusType } from '@/app/types/types';

interface ToastProps {
}

const Toast = ({ }: ToastProps) => {

    const { message, setMessage, status, setStatus } = useContext(StatusContext);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setOpen(true);
            if(status == StatusType.SUCCESS) {
                setTimeout(() => {
                    setOpen(false);
                }, 4000);
                setTimeout(() => {
                    setMessage(null);
                }, 4500);
            }
        }
    }, [message]);

    const onClose = () => {
        setOpen(false);
        setTimeout(() => {
            setMessage(null);
            setStatus(StatusType.SUCCESS);
        }, 500);
    }

    return (<>
        <div className={open ? `${styles.toast} ${styles.active}` : `${styles.toast}`}>
            <div className={styles.toast_content}>
                {status ==  StatusType.SUCCESS ? 
                    <FontAwesomeIcon icon={faCircleCheck} className={styles.check}/> :
                    <FontAwesomeIcon icon={faCircleExclamation} className={styles.fail}/>
                }
                <div className={styles.info}>
                    <span className={`${styles.text} ${styles.status}`}>{status}</span>
                    <span className={`${styles.text} ${styles.message}`}>{message}</span>
                </div>
            </div>
            <FontAwesomeIcon icon={faXmark} className={styles.close} onClick={onClose}/>
            {status == StatusType.SUCCESS && <div className={open ? `${styles.progress} ${styles.active}` : `${styles.progress}`}></div>}
        </div>
    </>)
}

export default Toast;