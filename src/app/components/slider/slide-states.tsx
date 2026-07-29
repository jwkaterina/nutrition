'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import cardStyles from '@/app/components/cards/card.module.css';
import styles from './slide-states.module.css';

export const useMinimumSkeletonTime = (initiallyReady: boolean, ms = 500): boolean => {
    const [elapsed, setElapsed] = useState(initiallyReady);
    useEffect(() => {
        if (elapsed) return;
        const t = setTimeout(() => setElapsed(true), ms);
        return () => clearTimeout(t);
    }, []);
    return elapsed;
};

export const SkeletonCard = (): JSX.Element => (
    <div className={cardStyles.placeholder}>
        <div className={`${cardStyles.card} ${styles.skeleton}`}>
            <div className={styles.skeleton_title} />
            <div className={styles.skeleton_row}>
                <div className={styles.skeleton_col} />
                <div className={styles.skeleton_col} />
                <div className={styles.skeleton_col} />
            </div>
        </div>
    </div>
);

interface EmptyStateProps {
    message: string;
    cta: string;
    search: string;
}

export const EmptyState = ({ message, cta, search }: EmptyStateProps): JSX.Element => (
    <div className={styles.empty_wrap}>
        <div className={styles.empty_card}>
            <p className={styles.empty_message}>{message}</p>
            <Link href={`/${search}`} className={styles.empty_cta}>{cta}</Link>
        </div>
    </div>
);

interface SignInPromptProps {
    kind: 'foods' | 'recipes' | 'menus';
}

export const SignInPrompt = ({ kind }: SignInPromptProps): JSX.Element => (
    <div className={styles.empty_wrap}>
        <div className={styles.empty_card}>
            <p className={styles.empty_message}>Sign in to see your {kind}.</p>
            <Link href="/auth/basic_auth" className={styles.empty_cta}>Sign in</Link>
        </div>
    </div>
);
