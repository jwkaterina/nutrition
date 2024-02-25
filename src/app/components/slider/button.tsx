import Link from 'next/link'
import styles from './slider.module.css'
import cardStyles from '@/app/components/cards/card.module.css'

interface ButtonProps {
    search: string
}

export const Button = ({ search }: ButtonProps): JSX.Element => {
    
    return (
        <div className={cardStyles.card}>
            <Link href={`/${search}`} className={styles.link}>
                <div className={styles.add__icon}>+</div>
            </Link> 
        </div>
    );
}

export default Button;