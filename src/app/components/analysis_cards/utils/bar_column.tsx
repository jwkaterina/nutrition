import styles from '../alanysis_card.module.css'
import { Nutrient } from '@/app/types/types'

interface BarColumnProps {
    vitamin: Nutrient,
    vitaminPercent: Nutrient,
    label: string,
    color: string,
    lightColor: string
}

const BarColumn = ({ vitamin, vitaminPercent, label, color, lightColor }: BarColumnProps): JSX.Element => {

    const barHeight = 100;
    let percentHeight = 0;
    if(vitaminPercent) percentHeight = vitaminPercent.quantity / 100 * barHeight;

    if(!vitamin) return <></>

    return <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`, backgroundColor: lightColor}}>
                    <div className={styles.percent_bar} style={{height: `${percentHeight}px`, backgroundColor: color}}></div>
                </div>                
                <p>{label}</p>
                <p>{`${vitamin.quantity} ${vitamin.unit}`}</p>
            </div>
}

export default BarColumn