import styles from './diagrams.module.css';

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
            <p>
                <span>{`${Math.round(percent)}% `}</span>
                {text}
            </p>
        </div>
    );
}

export default SmallCircle;