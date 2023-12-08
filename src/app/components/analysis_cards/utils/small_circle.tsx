import styles from './utils.module.css'

interface SmallCircleProps {
    percent: number,
    color: string,
    text: string
}

const SmallCircle = ({ percent, color, text }: SmallCircleProps): JSX.Element => {
    return (
        <div className={styles.composition_cell}>
            <div className={styles.circle} style={{backgroundColor: color}}></div>
            <p>{`${Math.round(percent)} % ${text}`}</p>
        </div>
    )
}

export default SmallCircle