import { useState, useCallback, useEffect } from 'react';
import { setToLocalStorage, getItemFromLocalStorage, removeFromLocalStorage } from "@/app/services/local-storage";

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();

    const login = useCallback((token: string, expirationDate?: Date) => {
        setToken(token);
        const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        setToLocalStorage(
            'userData',
            JSON.stringify({
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        removeFromLocalStorage('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(getItemFromLocalStorage('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout };
}