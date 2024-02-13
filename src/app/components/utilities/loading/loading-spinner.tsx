import { StatusContext } from '@/app/context/status-context';
import { useContext } from 'react';
import styles from './loading-spinner.module.css';

const LoadingSpinner = ( ): JSX.Element => {

    const isLoading = useContext(StatusContext).isLoading;

    if (!isLoading) return <></>;
    
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
        </div>
    );
}

export default LoadingSpinner;