import styles from '../../analysis_cards/alanysis_card.module.css';
import { Menu } from '@/app/types/types';

interface MenuHeaderCardProps {
    menu: Menu }

const MenuHeaderCard = ({ menu }: MenuHeaderCardProps): JSX.Element => {


    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div style={{padding: '2rem'}}>
                <div className={styles.header}>
                    <h1>{menu.name}</h1>      
                </div>
                <div className={styles.form}>
                    <select name="measure" id="measure">
                        <option>{menu.nutrients.totalWeight.toFixed(0)}g</option>
                    </select>
                </div>
            </div>
    </div>
    )
}

export default MenuHeaderCard;