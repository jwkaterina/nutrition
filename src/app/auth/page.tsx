'use client';

import styles from './page.module.css';
import NavBar from '@/app/components/navigation/nav-bar';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';
import { AuthContext, SetAuthContext } from '@/app/context/auth-context';
import { useState, useContext } from 'react';
import LoadingSpinner from '@/app/components/loading/loading-spinner';

const Auth = (): JSX.Element => {

    const tertiaryColor = "var(--tertiary-color)";

    const isLoggedIn = useContext(AuthContext);
    const setIsLoggedIn = useContext(SetAuthContext);
    const [loginMode, setLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        if (loginMode) {
            console.log(email, password)
        } else {
            const name = form.name.value;
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5001/auth/signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                  })
                });
        
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                  }
                  console.log(responseData);
                  setIsLoading(false);
                  setIsLoggedIn(true);
              } catch (err) {
                setIsLoading(false);
                setError(err.message || 'Something went wrong, please try again.');
              }
        }
    }

    return (<>
        <NavBar color={tertiaryColor}>
            <AuthMenu />
        </NavBar>
        {/* <ErrorModal error={error} onClear={() => setError(null)} /> */}
        <div className={styles.container}>
            {isLoading && <LoadingSpinner />}
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