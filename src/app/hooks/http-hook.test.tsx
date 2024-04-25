import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHttpClient } from './http-hook';
import { StatusContext } from '../context/status-context';
import { StatusType } from '../types/types';
import BackendError from '../error/backend-error';

describe('http-hook', () => {

    it('should render hook with resolved fetch and loading', async() => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({message: 'ok'})
        });

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useHttpClient(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const sendRequest =  result.current.sendRequest;
        await sendRequest(
            `/recipes`, 'GET', null, {
                Authorization: 'Bearer ' + 'token'
            }, true, true
        );
        expect(status.setIsLoading).toHaveBeenNthCalledWith(1, true);    
        expect(status.setIsLoading).toHaveBeenNthCalledWith(2, false);    
        expect(status.setStatus).toHaveBeenCalledWith(StatusType.SUCCESS);
    })

    it('should render hook with error', async() => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({message: 'Backend error'})
        });

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useHttpClient(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const sendRequest =  result.current.sendRequest;
        await expect(sendRequest(
            `/recipes`, 'GET', null, {
                Authorization: 'Bearer ' + 'token'
            }, true, true
        )).rejects.toThrow(BackendError);
        expect(status.setIsLoading).toHaveBeenNthCalledWith(1, true);    
        expect(status.setIsLoading).toHaveBeenNthCalledWith(2, false);    
        expect(status.setStatus).toHaveBeenCalledWith(StatusType.ERROR);
        expect(status.setMessage).toHaveBeenCalledWith('Backend error');
    })

})