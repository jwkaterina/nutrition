'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps): JSX.Element => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                fontFamily: 'system-ui, sans-serif',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 420 }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Something went wrong</h2>
                    <p style={{ margin: '0 0 1.5rem', color: '#555' }}>
                        A critical error occurred. Try reloading the page.
                    </p>
                    <button
                        style={{
                            height: '2.5rem',
                            padding: '0 1.25rem',
                            border: 'none',
                            borderRadius: 6,
                            background: '#333',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                        onClick={reset}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
};

export default GlobalError;
