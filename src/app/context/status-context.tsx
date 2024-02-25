import { createContext, useState } from "react";
import { StatusType } from "@/app/types/types";

interface StatusContextProps {
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<StatusType>(StatusType.SUCCESS);
    const [message, setMessage] = useState<string | null>(null);

    return (
        <StatusContext.Provider value={{
            isLoading,
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