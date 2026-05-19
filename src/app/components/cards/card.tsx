'use client';
import { useRef, useContext, useEffect } from 'react';
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';
import styles from './card.module.css';

interface CardProps {
    index: number,
    children: React.ReactNode,
    onCardClick: () => void,
    setIsOpen: (isOpen: boolean) => void,
    isOpen: boolean
}

const BODY_BACKGROUND = [
    'radial-gradient(ellipse at 15% 15%, var(--primary-lighter-color) 0%, transparent 55%)',
    'radial-gradient(ellipse at 85% 80%, var(--secondary-lighter-color) 0%, transparent 55%)',
    'radial-gradient(ellipse at 80% 10%, var(--tertiary-lightest) 0%, transparent 50%)',
    'radial-gradient(ellipse at 10% 85%, #F8BBD0 0%, transparent 50%)',
    'var(--blue-gray)',
].join(', ');

const ANIM_DURATION = 380;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION = `top ${ANIM_DURATION}ms ${EASING}, left ${ANIM_DURATION}ms ${EASING}, width ${ANIM_DURATION}ms ${EASING}, height ${ANIM_DURATION}ms ${EASING}, border-radius ${ANIM_DURATION}ms ${EASING}, padding-top ${ANIM_DURATION}ms ${EASING}, padding-bottom ${ANIM_DURATION}ms ${EASING}`;
const EXPANDED_TOP = '0';
const EXPANDED_HEIGHT = '100vh';

const Card = ({ index, children, onCardClick, setIsOpen, isOpen }: CardProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const needsStyleReset = useRef(false);

    // Reset card styles after React re-renders with closed content
    useEffect(() => {
        if (!isOpen && cardRef.current && needsStyleReset.current) {
            cardRef.current.style.cssText = '';
            needsStyleReset.current = false;
        }
    }, [isOpen]);

    const handleClick = () => {
        if (isOpen) return;
        rectRef.current = placeholderRef.current?.getBoundingClientRect() ?? null;
        onCardClick();
    };

    useEffect(() => {
        const card = cardRef.current;
        if (!card || !isOpen) return;

        if (cardOpen === CardState.OPENING) {
            const r = rectRef.current;
            if (!r) return;

            // Snap card to exact placeholder position (no visual jump)
            card.style.transition = 'none';
            card.style.cursor = 'default';
            card.style.position = 'fixed';
            card.style.top = `${r.top}px`;
            card.style.left = `${r.left}px`;
            card.style.width = `${r.width}px`;
            card.style.height = `${r.height}px`;
            card.style.zIndex = '2';
            card.style.borderRadius = '0.2rem';
            card.style.overflow = 'hidden';
            card.style.paddingTop = '0';
            card.style.paddingBottom = '0';
            card.style.background = BODY_BACKGROUND;
            card.style.backgroundAttachment = 'fixed';

            void card.offsetHeight; // force reflow before transition

            // Expand to fill the viewport; padding animates in to avoid jump
            card.style.transition = TRANSITION;
            card.style.top = EXPANDED_TOP;
            card.style.left = '0';
            card.style.width = '100vw';
            card.style.height = EXPANDED_HEIGHT;
            card.style.borderRadius = '0';
            card.style.paddingTop = 'calc(var(--header-height) + 1rem)';
            card.style.paddingBottom = 'calc(var(--header-height) + 1rem)';

            const timer = setTimeout(() => {
                card.style.overflow = 'auto';
                setCardOpen(CardState.OPEN);
            }, ANIM_DURATION);
            return () => clearTimeout(timer);
        }

        if (cardOpen === CardState.OPEN) {
            card.style.transition = 'none';
            card.style.position = 'fixed';
            card.style.top = EXPANDED_TOP;
            card.style.left = '0';
            card.style.width = '100vw';
            card.style.height = EXPANDED_HEIGHT;
            card.style.zIndex = '2';
            card.style.borderRadius = '0';
            card.style.overflow = 'auto';
            card.style.paddingTop = 'calc(var(--header-height) + 1rem)';
            card.style.paddingBottom = 'calc(var(--header-height) + 1rem)';
            card.style.background = BODY_BACKGROUND;
            card.style.backgroundAttachment = 'fixed';
        }

        if (cardOpen === CardState.CLOSING) {
            const r = placeholderRef.current?.getBoundingClientRect();
            if (!r) return;

            // Jump top to var(--header-height) — invisible behind the fixed header (z-index:3).
            // With paddingTop reverted to CSS 1rem, content sits at header-height+1rem,
            // matching exactly where the open card's content appeared.
            card.style.transition = 'none';
            card.style.top = 'var(--header-height)';
            card.style.left = '0';
            card.style.width = '100vw';
            card.style.height = `calc(${EXPANDED_HEIGHT} - var(--header-height))`;
            card.style.paddingTop = '';
            card.style.paddingBottom = '';
            card.style.overflow = 'hidden';

            void card.offsetHeight;

            // Shrink back to placeholder position
            card.style.transition = TRANSITION;
            card.style.top = `${r.top}px`;
            card.style.left = `${r.left}px`;
            card.style.width = `${r.width}px`;
            card.style.height = `${r.height}px`;
            card.style.borderRadius = '0.2rem';

            const timer = setTimeout(() => {
                needsStyleReset.current = true;
                setIsOpen(false);
                setCardOpen(CardState.CLOSED);
            }, ANIM_DURATION);
            return () => clearTimeout(timer);
        }

        if (cardOpen === CardState.CLOSED) {
            card.style.cssText = '';
            setIsOpen(false);
        }
    }, [cardOpen, isOpen]);

    return (
        <div ref={placeholderRef} className={styles.placeholder} onClick={handleClick}>
            <div ref={cardRef} className={styles.card}>
                {children}
            </div>
        </div>
    );
}

export default Card;
