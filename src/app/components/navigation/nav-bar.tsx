'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { StatusContext } from '@/app/context/status-context';
import { CardState, StatusType } from '@/app/types/types';
import styles from "./nav-bar.module.css";

interface NavBarProps {
    color: string,
    textColor?: string,
    children: React.ReactNode,
}

const NavBar = ({ color, textColor, children }: NavBarProps): JSX.Element => {

    const router = useRouter();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setStatus, setMessage } = useContext(StatusContext);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            logout();
            setCardOpen(CardState.CLOSED);
            setStatus(StatusType.SUCCESS);
            setMessage('Logged out');
        } else {
            setCardOpen(CardState.CLOSED);
            router.push('/auth/basic_auth');
        }
    }

    return (
        <nav className={styles.container} style={{ background: color, '--nav-link-color': textColor } as React.CSSProperties}>
            <div className={styles.nav_center}>{children}</div>
            <button className={styles.icon_button} onClick={handleAuthClick} title={isLoggedIn ? 'Logout' : 'Login'}>
                {isLoggedIn ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                )}
            </button>
        </nav>
    );
}

export default NavBar;
