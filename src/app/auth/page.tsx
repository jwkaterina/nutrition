'use client';

import styles from './page.module.css';
import NavBar from '@/app/components/navigation/nav-bar';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';
import { AuthContext } from '@/app/context/auth-context';
import { useState, useContext } from 'react';
import { useRouter} from 'next/navigation';
import { SlideContext } from '@/app/context/slide-context';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';

interface AuthProps {
}

const Auth = ({ }: AuthProps): JSX.Element => {

    const tertiaryColor: string = "var(--tertiary-color)";
    const { sendRequest } = useHttpClient();
    const { setScrollBehavior } = useContext(SlideContext);
    const { login } = useContext(AuthContext);
    const [loginMode, setLoginMode] = useState<boolean>(true);
    const { setMessage } = useContext(StatusContext);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form: HTMLFormElement = e.currentTarget;
        const email: string = form.email.value;
        const password: string = form.password.value;
        
        if (loginMode) {
            try {
                const body: string = JSON.stringify({
                    email,
                    password
                })
                const responseData = await sendRequest(
                    'http://localhost:5001/users/login',
                    'POST',
                    body,
                    {
                        'Content-Type': 'application/json'
                    }
                );
                login(responseData.userId, responseData.token);
                setMessage('Logged in');
                goBack();
            } catch (err) { }
        } else {
            const formName = form.name as unknown as HTMLInputElement;
            const name: string = formName.value;
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

                login(responseData.userId, responseData.token);
                goBack();
                setMessage('Signed up');
              } catch (err) {}
        }
    }

    const goBack = () => {
        setScrollBehavior('auto');
        router.back();
        setTimeout(() => {
            setScrollBehavior('smooth');
        }, 500);
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
            <button className={styles.switch_button} onClick={() => setLoginMode(!loginMode)}>{`Switch to ${loginMode ? 'Signup' : 'Login'}`}</button>
        </div>
    </>
    )
}

export default Auth