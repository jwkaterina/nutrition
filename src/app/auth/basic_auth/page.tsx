'use client';

import { useState, useContext, useEffect, useRef } from 'react';
import { useRouter} from 'next/navigation';
import AuthMenu from '@/app/components/navigation/menus/auth-menu';
import NavBar from '@/app/components/navigation/nav-bar';
import { AuthContext } from '@/app/context/auth-context';
import { SlideContext } from '@/app/context/slide-context';
import { StatusContext } from '@/app/context/status-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { SlideType } from '@/app/types/types';
import styles from './page.module.css';

const Auth = (): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const { setScrollBehavior, slide } = useContext(SlideContext);
    const { login, token } = useContext(AuthContext);
    const [loginMode, setLoginMode] = useState<boolean>(true);
    const { setMessage } = useContext(StatusContext);
    const router = useRouter();
    const shouldNavigate = useRef(false);

    useEffect(() => {
        if (!token || !shouldNavigate.current) return;
        shouldNavigate.current = false;
        setScrollBehavior('auto');
        const tabNames = { [SlideType.FOOD]: 'food', [SlideType.RECIPE]: 'recipe', [SlideType.MENU]: 'menu' };
        router.replace(`/?tab=${tabNames[slide]}`);
        setTimeout(() => setScrollBehavior('smooth'), 500);
    }, [token]);

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
                    '/users/login',
                    'POST',
                    body,
                    {
                        'Content-Type': 'application/json'
                    }
                );
                shouldNavigate.current = true;
                login(responseData.token);
                setMessage('Logged in');
            } catch (err) { }
        } else {
            const formName = form.name as unknown as HTMLInputElement;
            const name: string = formName.value;
            try {
                const responseData = await sendRequest(
                    '/users/signup',
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

                shouldNavigate.current = true;
                login(responseData.token);
                setMessage('Signed up');
              } catch (err) {}
        }
    }

    return (
        <>
            <NavBar color="var(--primary-glass)" textColor="white">
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
    );
}

export default Auth;