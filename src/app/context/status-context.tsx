import { createContext, useState, useCallback } from "react";
import { StatusType } from "@/app/types/types";

interface StatusContextProps {
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    status: StatusType,
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>,
    message: string | null,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>
}

export const StatusContext = createContext<StatusContextProps>({
    isLoading: false,
    setIsLoading: () => { },
    status: StatusType.SUCCESS,
    setStatus: () => { },
    message: null,
    setMessage: () => { }
});

export const StatusProvider = ({ children }: any) => {

    const [loadingCount, setLoadingCount] = useState<number>(0);
    const [status, setStatus] = useState<StatusType>(StatusType.SUCCESS);
    const [message, setMessage] = useState<string | null>(null);

    const setIsLoading = useCallback((loading: boolean) => {
        setLoadingCount(count => loading ? count + 1 : Math.max(0, count - 1));
    }, []);

    return (
        <StatusContext.Provider value={{
            isLoading: loadingCount > 0,
            setIsLoading,
            status,
            setStatus,
            message,
            setMessage
        }}>
            {children}
        </StatusContext.Provider>
    );
}