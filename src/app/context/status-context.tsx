'use client';
import { createContext, useState, useCallback } from "react";
import { StatusType } from "@/app/types/types";

export interface ToastAction {
    label: string;
    onClick: () => void;
}

interface StatusContextProps {
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    status: StatusType,
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>,
    message: string | null,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>,
    action: ToastAction | null,
    setAction: (action: ToastAction | null) => void
}

export const StatusContext = createContext<StatusContextProps>({
    isLoading: false,
    setIsLoading: () => { },
    status: StatusType.SUCCESS,
    setStatus: () => { },
    message: null,
    setMessage: () => { },
    action: null,
    setAction: () => { }
});

export const StatusProvider = ({ children }: any) => {

    const [loadingCount, setLoadingCount] = useState<number>(0);
    const [status, setStatus] = useState<StatusType>(StatusType.SUCCESS);
    const [message, setMessageRaw] = useState<string | null>(null);
    const [action, setAction] = useState<ToastAction | null>(null);

    const setIsLoading = useCallback((loading: boolean) => {
        setLoadingCount(count => loading ? count + 1 : Math.max(0, count - 1));
    }, []);

    const setMessage: React.Dispatch<React.SetStateAction<string | null>> = useCallback((next) => {
        setMessageRaw(next);
        setAction(null);
    }, []);

    return (
        <StatusContext.Provider value={{
            isLoading: loadingCount > 0,
            setIsLoading,
            status,
            setStatus,
            message,
            setMessage,
            action,
            setAction
        }}>
            {children}
        </StatusContext.Provider>
    );
}