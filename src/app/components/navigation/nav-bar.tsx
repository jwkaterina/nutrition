import styles from "./nav-bar.module.css";

interface NavBarProps {
    color: string,
    textColor?: string,
    children: React.ReactNode,
}

const NavBar = ({ color, textColor, children }: NavBarProps): JSX.Element => {

    return (
        <nav className={styles.container} style={{background: color, '--nav-link-color': textColor} as React.CSSProperties}>
            {children}
        </nav>
    );
}

export default NavBar;

