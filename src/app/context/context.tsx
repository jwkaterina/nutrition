import { createContext, useState } from "react";

export const CardOpenContext = createContext<boolean>(false);
export const SetCardOpenContext = createContext<((cardOpen: boolean) => void)>(() => {});

export const CardOpenProvider = ({ children}: any) => {

    const [cardOpen, setCardOpen] = useState(false);

    return (
        <CardOpenContext.Provider value={cardOpen}>
            <SetCardOpenContext.Provider value={setCardOpen}>
                {children}
            </SetCardOpenContext.Provider>
        </CardOpenContext.Provider>
    )
}