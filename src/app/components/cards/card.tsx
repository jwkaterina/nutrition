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

const ANIM_DURATION = 380;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION = `top ${ANIM_DURATION}ms ${EASING}, left ${ANIM_DURATION}ms ${EASING}, width ${ANIM_DURATION}ms ${EASING}, height ${ANIM_DURATION}ms ${EASING}, border-radius ${ANIM_DURATION}ms ${EASING}`;
// Content area sits between top nav (60px) and bottom nav (60px)
const EXPANDED_TOP = 'var(--header-height)';
const EXPANDED_HEIGHT = 'var(--container-height)';

const Card = ({ index, children, onCardClick, setIsOpen, isOpen }: CardProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);

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
            card.style.position = 'fixed';
            card.style.top = `${r.top}px`;
            card.style.left = `${r.left}px`;
            card.style.width = `${r.width}px`;
            card.style.height = `${r.height}px`;
            card.style.zIndex = '2';
            card.style.borderRadius = '0.2rem';
            card.style.overflow = 'hidden';

            void card.offsetHeight; // force reflow before transition

            // Expand to fill the content area (between top and bottom nav)
            card.style.transition = TRANSITION;
            card.style.top = EXPANDED_TOP;
            card.style.left = '0';
            card.style.width = '100vw';
            card.style.height = EXPANDED_HEIGHT;
            card.style.borderRadius = '0';

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
        }

        if (cardOpen === CardState.CLOSING) {
            const r = placeholderRef.current?.getBoundingClientRect();
            if (!r) return;

            // Start from the expanded content-area position
            card.style.transition = 'none';
            card.style.top = EXPANDED_TOP;
            card.style.left = '0';
            card.style.width = '100vw';
            card.style.height = EXPANDED_HEIGHT;
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
                card.style.cssText = '';
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
