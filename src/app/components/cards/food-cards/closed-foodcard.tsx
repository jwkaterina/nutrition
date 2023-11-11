'use client'

import styles from '../card.module.css'
import { Food } from '@/app/types/types'

interface CardProps {
    food: Food,
}

const ClosedCard = ({ food }: CardProps): JSX.Element => {
    const { label, image } = food.food;
    const { ENERC_KCAL, PROCNT, FAT, CHOCDF } = food.food.nutrients;
    const kcal = Math.round(ENERC_KCAL);
    const prot = Math.round(PROCNT);
    const fat = Math.round(FAT);
    const carb = Math.round(CHOCDF);

    let title = label;
     if(title.length >30) title = title.substring(0,30) + '...';

     const isImage = (url: string) => {
        return /\.(jpg|jpeg)$/.test(url);
      }

    return (<>
        <div className={styles.title}>
                {isImage(image) && <img src={image} alt="" className={styles.img}/>}
                <h2>{title}</h2>
            </div>
             <div className={styles.nutrients}>
             <div className={styles.column}>
                 <h5>kcal</h5>
                 <p>{kcal}</p>
             </div>
             <div className={styles.column}>
                 <h5>prot</h5>
                 <p>{prot}</p>
             </div>
             <div className={styles.column}>
                 <h5>fat</h5>
                 <p>{fat}</p>
             </div>
             <div className={styles.column}>
                 <h5>carb</h5>
                 <p>{carb}</p>
             </div>
         </div> 
    </>)
}

export default ClosedCard