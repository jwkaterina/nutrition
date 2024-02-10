import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { StatusContext } from '../context/status-context';

export const useHttpClient = () => {
    const { setIsLoading } = useContext(StatusContext);

    // const activeHttpRequests = useRef<AbortController[]>([]);

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
                setTimeout(() => {
                    setIsLoading(false);
                }, 200);
                throw err;
            }
        },[]);

    // useEffect(() => {
    //   return () => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    //   };
    // }, []);

    return { sendRequest };
};
