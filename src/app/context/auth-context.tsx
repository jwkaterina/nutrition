import { createContext, useState } from "react";

interface AuthContextProps {
    isLoggedIn: boolean,
    token: string | null,
    setToken: React.Dispatch<React.SetStateAction<string | null>>,
    user: string | null,
    setUser: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    token: null,
    setToken: () => { },
    user: null,
    setUser: () => { }
});

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);
    const isLoggedIn = !!token;
    const [user, setUser] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            token,
            setToken,
            user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}