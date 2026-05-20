import { MenuProp } from '@/app/types/types';
import CardPlaceholder from '../../utilities/card-placeholder';
import styles from '../../analysis-cards/alanysis-card.module.css';

interface MenuHeaderCardProps {
    menu: MenuProp,
    image?: string | null,
}

const MenuHeaderCard = ({ menu, image = null }: MenuHeaderCardProps): JSX.Element => {

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={{ gridTemplateColumns: '1fr 3fr' }}>
                {image
                    ? <img src={image} alt={menu.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    : <CardPlaceholder name={menu.name} size={100} borderRadius="var(--radius-sm)" />
                }
                <h1>{menu.name}</h1>
            </div>
            <div className={styles.form}>
                <div className={styles.long_input} id="measure">{`1 serving - ${(menu.nutrients?.totalWeight ?? 0).toFixed(0)}g`}</div>
            </div>
        </div>
    );
}

export default MenuHeaderCard;