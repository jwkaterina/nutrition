'use client'

import styles from "./nav-bar.module.css"

interface FooterProps {
    color: string,
}

const Footer = ({ color }: FooterProps): JSX.Element => {

    return (
        <nav className={styles.footer} style={{background: color}}>
            <div className={styles.footer_links}>
				<a className={styles.link} onClick={() => console.log('settings')}>Settings</a>
				<a className={styles.link} onClick={() => console.log('auth')}>Authentication</a>
		</div>
        </nav>
    )
}

export default Footer