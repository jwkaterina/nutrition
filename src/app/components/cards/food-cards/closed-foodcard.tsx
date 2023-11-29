'use client'

import styles from '../card.module.css'
import { Food } from '@/app/types/types'

interface CardProps {
    food: Food,
}

const ClosedCard = ({ food }: CardProps): JSX.Element => {
    const { label, image } = food.food;
    // const { ENERC_KCAL, PROCNT, FAT, CHOCDF } = food.food.nutrients;
    // const kcal = ENERC_KCAL;
    // const prot = PROCNT;
    // const fat = FAT;
    // const carb = CHOCDF;

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
                 <p>{food && food.food.nutrients.ENERC_KCAL}</p>
             </div>
             <div className={styles.column}>
                 <h5>prot</h5>
                 <p>{food && food.food.nutrients.PROCNT}</p>
             </div>
             <div className={styles.column}>
                 <h5>fat</h5>
                 <p>{food && food.food.nutrients.FAT}</p>
             </div>
             <div className={styles.column}>
                 <h5>carb</h5>
                 <p>{food && food.food.nutrients.CHOCDF}</p>
             </div>
         </div> 
    </>)
}

export default ClosedCard