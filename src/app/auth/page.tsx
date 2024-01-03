'use client';

import styles from './page.module.css';
import NavBar from '@/app/components/navigation/nav-bar';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';
import { useState } from 'react';

const Auth = (): JSX.Element => {

    const tertiaryColor = "var(--tertiary-color)";

    const [loginMode, setLoginMode] = useState(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        if (loginMode) {
            console.log(email, password)
        } else {
            const name = form.name.value;
            console.log(name, email, password)
        }
    }

    return (<>
        <NavBar color={tertiaryColor}>
            <AuthMenu />
        </NavBar>
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {!loginMode && <div className={styles.form_group}>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" required />
                </div>}
                <div className={styles.form_group}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" required/>
                </div>
                <div className={styles.form_group}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" minLength={5} required/>
                </div>
                <div className={styles.form_group}>
                    <button type="submit">{loginMode ? 'Login' : 'Signup'}</button>
                </div>
            </form>
            <button className={styles.button} onClick={() => setLoginMode(!loginMode)}>{`Switch to ${loginMode ? 'Signup' : 'Login'}`}</button>
        </div>
    </>
    )
}

export default Auth