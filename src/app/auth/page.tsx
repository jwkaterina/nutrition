'use client';

import styles from './page.module.css';
import NavBar from '@/app/components/navigation/nav-bar';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';
import { AuthContext } from '@/app/context/auth-context';
import { useState, useContext } from 'react';
import LoadingSpinner from '@/app/components/loading/loading-spinner';
import ErrorModal from '../components/error-modal/error-modal';
import { useRouter} from 'next/navigation';
import { SetBlockScrollContext } from '@/app/context/slide-context';
import { useHttpClient } from '@/app/hooks/http-hook';

const Auth = (): JSX.Element => {

    const tertiaryColor = "var(--tertiary-color)";
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const setBlockScroll = useContext(SetBlockScrollContext);
    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    const [loginMode, setLoginMode] = useState(true);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        
        if (loginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5001/users/login',
                    'POST',
                    JSON.stringify({
                        email,
                        password
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                setIsLoggedIn(true);
                setUser(responseData.user.id);
                goBack();
            } catch (err) {}
        } else {
            const name = form.name.value;
            try {
                const responseData = await sendRequest(
                  'http://localhost:5001/users/signup',
                  'POST',
                  JSON.stringify({
                    name,
                    email,
                    password
                  }),
                  {
                    'Content-Type': 'application/json'
                  }
                );

                setIsLoggedIn(true);
                setUser(responseData.user.id);
                goBack();
              } catch (err) {}
        }
    }

    const goBack = () => {
        setBlockScroll(true);
        router.back();
        setTimeout(() => {
            setBlockScroll(false);
        }, 500)
    }

    return (<>
        <NavBar color={tertiaryColor}>
            <AuthMenu />
        </NavBar>
        {error && <ErrorModal error={error} onClose={clearError} />}
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
            <button className={styles.switch_button} onClick={() => setLoginMode(!loginMode)}>{`Switch to ${loginMode ? 'Signup' : 'Login'}`}</button>
        </div>
    </>
    )
}

export default Auth