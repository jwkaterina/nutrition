import styles from '../../analysis_cards/alanysis_card.module.css';
import { MenuProp } from '@/app/types/types';

interface MenuHeaderCardProps {
    menu: MenuProp
}

const MenuHeaderCard = ({ menu }: MenuHeaderCardProps): JSX.Element => {

    const style = {
                display: 'grid',
                gridTemplateColumns: '1fr'
            }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={style}>
                <h1>{menu.name}</h1>      
            </div>
            <div className={styles.form}>
                <div className={styles.long_input} id="measure">{`1 serving - ${(menu.nutrients.totalWeight).toFixed(0)}g`}</div>
            </div>
        </div>
    )
}

export default MenuHeaderCard;