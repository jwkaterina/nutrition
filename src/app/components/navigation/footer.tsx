'use client'

import styles from "./nav-bar.module.css"
import { useRouter } from 'next/navigation'

interface FooterProps {
    color: string,
}

const Footer = ({ color }: FooterProps): JSX.Element => {

    const router = useRouter();

    return (
        <nav className={styles.footer} style={{background: color}}>
            <div className={styles.footer_links}>
				<a className={styles.link} onClick={() => console.log('settings')}>Settings</a>
				<a className={styles.link} onClick={() => router.push('/auth')}>Authentication</a>
		</div>
        </nav>
    )
}

export default Footer