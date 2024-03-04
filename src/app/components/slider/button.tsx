import Link from 'next/link'
import { useRouter} from 'next/navigation';
import styles from './slider.module.css'
import cardStyles from '@/app/components/cards/card.module.css'

interface ButtonProps {
    search: string
}

export const Button = ({ search }: ButtonProps): JSX.Element => {
    
    const router = useRouter();
    const handleClick = () => {
        router.push(`/${search}`);
    }
    return (
        <div className={cardStyles.card}>
            <div onClick={handleClick} className={styles.link}>
                <div className={styles.add__icon}>+</div>
            </div> 
        </div>
    );
}

export default Button;