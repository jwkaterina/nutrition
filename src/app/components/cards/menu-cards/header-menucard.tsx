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
                <input className={styles.long_input} name="measure" id="measure" value={`1 serving - ${(menu.nutrients.totalWeight).toFixed(0)}g`}></input>
            </div>
        </div>
    )
}

export default MenuHeaderCard;