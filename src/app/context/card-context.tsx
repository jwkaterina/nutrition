import { createContext, useState } from "react";
import { CardState } from "../types/types";

export const CardOpenContext = createContext<CardState>(CardState.CLOSED);
export const SetCardOpenContext = createContext((() => {}) as React.SetStateAction<any>);

export const CardOpenProvider = ({ children }: any) => {

    const [cardOpen, setCardOpen] = useState(CardState.CLOSED);

    return (
        <CardOpenContext.Provider value={cardOpen}>
            <SetCardOpenContext.Provider value={setCardOpen}>
                {children}
            </SetCardOpenContext.Provider>
        </CardOpenContext.Provider>
    )
}