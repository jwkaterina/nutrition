import { createContext, useState } from "react";

interface AuthContextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    user: string | null,
    setUser: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    user: null,
    setUser: () => { }
});

export const AuthProvider = ({ children }: any) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);

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