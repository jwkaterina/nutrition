import { useCallback, useContext } from 'react';
import { StatusContext } from '../context/status-context';
import { StatusType } from '../types/types';
import BackendError from '../error/backend-error';

export const useHttpClient = () => {
    const { setIsLoading, setStatus, setMessage } = useContext(StatusContext);

    const sendRequest = useCallback(
        async (url: string, method: string = 'GET', body: null | string | FormData = null, headers = {}, isLoading: boolean = true, setStatusSuccess: boolean = true): Promise<any> => {
            if(isLoading == true) setIsLoading(true);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });

                const responseData = await response.json();
                if (!response.ok) {
                    throw new BackendError(responseData.message);
                }

                setIsLoading(false);
                if(setStatusSuccess) setStatus(StatusType.SUCCESS);
                return responseData;
            } catch (err) {
                console.error(err);
                setIsLoading(false);
                setStatus(StatusType.ERROR);
                if (err instanceof BackendError) {
                    setMessage((err as Error).message)
                } else { 
                    setMessage('Oops, something went wrong.');
                }
                throw err;
            }
        },[]);

    return { sendRequest };
}
