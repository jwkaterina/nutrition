import styles from './page.module.css';
import NavBar from '@/app/components/navigation/nav-bar';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';

const Auth = (): JSX.Element => {

    const tertiaryColor = "var(--tertiary-color)";
    return (<>
        <NavBar color={tertiaryColor}>
            <AuthMenu />
        </NavBar>
        <div className={styles.container}>
            <h1>Auth</h1>
        </div>
    </>
    )
}

export default Auth