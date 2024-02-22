import { createContext } from "react";
import { useAuth } from "@/app/hooks/auth-hook";

interface AuthContextProps {
    isLoggedIn: boolean,
    token: string | null,
    user: string | null,
    login: (uid: string, token: string, expiration?: Date) => void,
    logout: () => void
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    token: null,
    user: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: any) => {
    const { token, login, logout, user } = useAuth();
    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            token,
            user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}