import { useEffect, useContext,useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { StatusContext } from '@/app/context/status-context';
import { StatusType } from '@/app/types/types';
import styles from './toast.module.css';

const Toast = () => {

    const { message, status } = useContext(StatusContext);
    const [open, setOpen] = useState(false);
    const [openTimeout, setOpenTimeout] = useState<NodeJS.Timeout | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const progress: Animation | undefined = progressRef.current?.animate([
        {width: '0%'},
        {width: '100%'}
    ], {
        duration: 4000,
        fill: 'forwards'
    });

    useEffect(() => {
        const removeMessage = () => {
            setOpen(false);
        };
        document.addEventListener("click", removeMessage);
	}, []);

    useEffect(() => {
        clearTimeout(openTimeout!);
        progress?.cancel();

        if (message) {
            setTimeout(() => {
                setOpen(true);
                progress?.play();
            }, 100);
            if(status == StatusType.SUCCESS) {
                const openTimeout = setTimeout(() => {
                    setOpen(false);
                }, 4000);
                setOpenTimeout(openTimeout);
            }
        }
    }, [message, status]);

    const onClose = () => {
        setOpen(false);
    }

    return (
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
            {status == StatusType.SUCCESS && <div ref={progressRef} className={styles.progress}></div>}
        </div>
    );
}

export default Toast;