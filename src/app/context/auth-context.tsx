import { createContext } from "react";
import { useAuth } from "@/app/hooks/auth-hook";

interface AuthContextProps {
    isLoggedIn: boolean,
    token: string | null,
    login: (token: string, expiration?: Date) => void,
    logout: () => void
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    token: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: any) => {
    const { token, login, logout } = useAuth();
    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}