import { createContext, useState } from "react";

export const AuthContext = createContext<boolean>(false);
export const SetAuthContext = createContext((() => {}) as React.SetStateAction<any>);

export const AuthProvider = ({ children }: any) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={isLoggedIn}>
            <SetAuthContext.Provider value={setIsLoggedIn}>
                {children}
            </SetAuthContext.Provider>
        </AuthContext.Provider>
    )
}