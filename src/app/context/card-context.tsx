import { createContext, useState, useMemo } from "react";
import { CardState } from "../types/types";

interface CardContextProps {
    cardOpen: CardState,
    setCardOpen: React.Dispatch<React.SetStateAction<CardState>>
}

export const CardOpenContext = createContext<CardContextProps>({
    cardOpen: CardState.CLOSED,
    setCardOpen: () => {}
});

export const CardOpenProvider = ({ children }: any) => {

    const [cardOpen, setCardOpen] = useState<CardState>(CardState.CLOSED);

    const contextValue = useMemo(() => ({
            cardOpen,
            setCardOpen
        }), [cardOpen, setCardOpen]
    )

    return (
        <CardOpenContext.Provider value={contextValue}>
            {children}
        </CardOpenContext.Provider>
    );
}