import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();

    const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(
        async (url: string, method: string = 'GET', body: null | string = null, headers = {}) => {
            setIsLoading(true);
            // const httpAbortCtrl = new AbortController();
            // activeHttpRequests.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    // signal: httpAbortCtrl.signal
                });

                const responseData = await response.json();

                // activeHttpRequests.current = activeHttpRequests.current.filter(
                //   reqCtrl => reqCtrl !== httpAbortCtrl
                // );

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setTimeout(() => {
                    setIsLoading(false);
                }, 200);
                return responseData;
            } catch (err) {
                const message = (err as Error).message;
                setError(message);
                setTimeout(() => {
                    setIsLoading(false);
                }, 200);
                throw err;
            }
        },[]);

    const clearError = () => {
        setError(null);
    };

    // useEffect(() => {
    //   return () => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    //   };
    // }, []);

    return { isLoading, error, sendRequest, clearError };
};
