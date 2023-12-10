import styles from './utils.module.css'

interface SmallCircleProps {
    percent: number,
    color: string,
    text: string,
    heightWidth: number
}

const SmallCircle = ({ percent, color, text, heightWidth }: SmallCircleProps): JSX.Element => {
    return (
        <div className={styles.composition_cell}>
            <div className={styles.circle} style={{backgroundColor: color, height: heightWidth, width: heightWidth}}></div>
            <p>{`${Math.round(percent)} % ${text}`}</p>
        </div>
    )
}

export default SmallCircle