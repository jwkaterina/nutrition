'use client'

import styles from "./nav-bar.module.css"
import { useRouter } from 'next/navigation'
import { useContext } from "react";
import { AuthContext } from "@/app/context/auth-context";

interface FooterProps {
    color: string,
}

const Footer = ({ color }: FooterProps): JSX.Element => {

    const router = useRouter();
    const { isLoggedIn } = useContext(AuthContext);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            // logout
        } else {
            router.push('/auth')
        }
    }

    return (
        <nav className={styles.footer} style={{background: color}}>
            <div className={styles.footer_links}>
				<a className={styles.link} onClick={() => console.log('settings')}>Settings</a>
				<a className={styles.link} onClick={handleAuthClick}>{isLoggedIn ? 'Logout' : 'Login'}</a>
		</div>
        </nav>
    )
}

export default Footer