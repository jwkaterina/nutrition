import { createContext, useState } from "react";

export const CardOpenContext = createContext<number | null>(null);
export const SetCardOpenContext = createContext((() => {}) as React.SetStateAction<any>);

export const CardOpenProvider = ({ children }: any) => {

    const [cardOpen, setCardOpen] = useState(null);

    return (
        <CardOpenContext.Provider value={cardOpen}>
            <SetCardOpenContext.Provider value={setCardOpen}>
                {children}
            </SetCardOpenContext.Provider>
        </CardOpenContext.Provider>
    )
}

export const ScrollContext = createContext<boolean>(false);
export const SetScrollContext = createContext((() => {}) as React.SetStateAction<any>);

export const ScrollProvider = ({ children }: any) => {

    const [scroll, setScroll] = useState(false);

    return (
        <ScrollContext.Provider value={scroll}>
            <SetScrollContext.Provider value={setScroll}>
                {children}
            </SetScrollContext.Provider>
        </ScrollContext.Provider>
    )
}