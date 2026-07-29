'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps): JSX.Element => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Something went wrong</h2>
                <p className={styles.message}>
                    We hit an unexpected error. Try again, or reload the page.
                </p>
                <div className={styles.actions}>
                    <button className={styles.primary} onClick={reset}>Try again</button>
                    <button className={styles.secondary} onClick={() => location.reload()}>Reload page</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
