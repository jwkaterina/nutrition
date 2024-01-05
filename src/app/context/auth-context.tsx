import { createContext, useState } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (value: boolean) => { },
    user: null,
    setUser: (value: any) => { }
});
// export const SetAuthContext = createContext((() => {}) as React.SetStateAction<any>);
// export const UserContext = createContext({});
// export const SetUserContext = createContext((() => {}) as React.SetStateAction<any>);

export const AuthProvider = ({ children }: any) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}