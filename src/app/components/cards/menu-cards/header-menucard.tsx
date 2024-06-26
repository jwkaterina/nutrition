import { MenuProp } from '@/app/types/types';
import styles from '../../analysis-cards/alanysis-card.module.css';

interface MenuHeaderCardProps {
    menu: MenuProp
}

const MenuHeaderCard = ({ menu }: MenuHeaderCardProps): JSX.Element => {

    const style = { gridTemplateColumns: '1fr' }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={style}>
                <h1>{menu.name}</h1>      
            </div>
            <div className={styles.form}>
                <div className={styles.long_input} id="measure">{`1 serving - ${(menu.nutrients.totalWeight).toFixed(0)}g`}</div>
            </div>
        </div>
    );
}

export default MenuHeaderCard;