import styles from './card.module.css'

interface ClosedCardProps {
    title: string,
    image: string,
    calories: number,
    protein: number,
    fat: number,
    carbs: number
}

const ClosedCard = ({ title, image, calories, protein, fat, carbs }: ClosedCardProps): JSX.Element => {

     if(title.length >30) title = title.substring(0,30) + '...';

     const isImage = (image: string) => {
        return /\.(jpg|jpeg)$/.test(image);
      }

    return (<>
        <div className={styles.title}>
                {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                <h2>{title}</h2>
            </div>
             <div className={styles.nutrients}>
             <div className={styles.column}>
                 <h5>kcal</h5>
                 <p>{calories}</p>
             </div>
             <div className={styles.column} style={{color: 'var(--primary-color)'}}>
                 <h5>prot</h5>
                 <p>{protein.toFixed(0)}</p>
             </div>
             <div className={styles.column} style={{color: 'var(--tertiary-color)'}}>
                 <h5>fat</h5>
                 <p>{fat.toFixed(0)}</p>
             </div>
             <div className={styles.column} style={{color: 'var(--secondary-color)'}}>
                 <h5>carb</h5>
                 <p>{carbs.toFixed(0)}</p>
             </div>
         </div> 
    </>)
}

export default ClosedCard