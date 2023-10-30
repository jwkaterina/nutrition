import { createContext, useState } from "react";

export const CardOpenContext = createContext<boolean | null>(null);
export const SetCardOpenContext = createContext((() => {}) as React.SetStateAction<any>);

export const CardOpenProvider = ({ children}: any) => {

    const [cardOpen, setCardOpen] = useState(null);

    return (
        <CardOpenContext.Provider value={cardOpen}>
            <SetCardOpenContext.Provider value={setCardOpen}>
                {children}
            </SetCardOpenContext.Provider>
        </CardOpenContext.Provider>
    )
}