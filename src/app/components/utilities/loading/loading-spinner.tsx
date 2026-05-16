import { useContext, useEffect, useState } from 'react';
import { StatusContext } from '@/app/context/status-context';
import styles from './loading-spinner.module.css';

const LoadingSpinner = ( ): JSX.Element => {

    const isLoading = useContext(StatusContext).isLoading;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (!visible) return <></>;

    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
        </div>
    );
}

export default LoadingSpinner;