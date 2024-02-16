import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { StatusContext } from '../context/status-context';
import { StatusType } from '../types/types';

export const useHttpClient = () => {
    const { setIsLoading, setStatus } = useContext(StatusContext);

    // const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(
        async (url: string, method: string = 'GET', body: null | string | FormData = null, headers = {}) => {
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
                    throw new Error('An error occurred');
                }

                setIsLoading(false);
                setStatus(StatusType.SUCCESS);
                return responseData;
            } catch (err) {
                setIsLoading(false);
                setStatus(StatusType.ERROR);
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
