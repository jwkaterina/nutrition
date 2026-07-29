'use client';
import { useEffect, useState } from 'react';
import styles from './first-run-tour.module.css';

const STORAGE_KEY = 'nutrition_tour_seen_v1';

interface Step {
    title: string;
    body: string;
}

const STEPS: Step[] = [
    {
        title: 'Welcome to Nutrition',
        body: 'Track what you eat by building up a library of foods, recipes, and meal plans. Swipe between tabs to see each.',
    },
    {
        title: 'Foods',
        body: 'A single ingredient — an apple, a slice of bread, a spoonful of oil. Search, analyze the nutrients, and save it to your library for later.',
    },
    {
        title: 'Recipes',
        body: 'Multiple ingredients combined. Add foods with quantities and the total nutrients per serving are calculated for you.',
    },
    {
        title: 'Menus',
        body: 'A meal plan built from recipes (and optional extra ingredients). Great for weekly planning or tracking a full day.',
    },
];

const FirstRunTour = (): JSX.Element | null => {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        } catch {
            // localStorage disabled — just skip the tour silently
        }
    }, []);

    const dismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, '1');
        } catch {}
        setVisible(false);
    };

    if (!visible) return null;

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    return (
        <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="tour-title">
            <div className={styles.card}>
                <button className={styles.skip} onClick={dismiss} aria-label="Skip tour">Skip</button>
                <h2 id="tour-title" className={styles.title}>{current.title}</h2>
                <p className={styles.body}>{current.body}</p>

                <div className={styles.dots}>
                    {STEPS.map((_, i) => (
                        <span
                            key={i}
                            className={i === step ? `${styles.dot} ${styles.dot_active}` : styles.dot}
                        />
                    ))}
                </div>

                <div className={styles.actions}>
                    {step > 0 && (
                        <button className={styles.secondary} onClick={() => setStep(step - 1)}>Back</button>
                    )}
                    {!isLast && (
                        <button className={styles.primary} onClick={() => setStep(step + 1)}>Next</button>
                    )}
                    {isLast && (
                        <button className={styles.primary} onClick={dismiss}>Get started</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirstRunTour;
