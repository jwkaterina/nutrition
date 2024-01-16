import styles from '../card.module.css'
import { Recipe } from '@/app/types/types'

interface ClosedRecipeCardProps {
    recipe: Recipe,
}

const ClosedRecipeCard = ({ recipe }: ClosedRecipeCardProps): JSX.Element => {
    // const { label, image } = food.food;

    // let title: string = label;
    // if(title.length >30) title = title.substring(0,30) + '...';

    // const isImage = (url: string) => {
    //     return /\.(jpg|jpeg)$/.test(url);
    // }

    return (<>
        <div className={styles.title}>
                {/* {isImage(image) && <img src={image} alt="" className={styles.img}/>} */}
                <h2>{recipe.name}</h2>
            </div>
             <div className={styles.nutrients}>
                <div className={styles.column}>
                    <h5>kcal</h5>
                    <p>{recipe && recipe.nutrients.totalNutrients.ENERC_KCAL.quantity}</p>
                </div>
                <div className={styles.column} style={{color: 'var(--primary-color)'}}>
                    <h5>prot</h5>
                    <p>{recipe && recipe.nutrients.totalNutrients.PROCNT.quantity}</p>
                </div>
                <div className={styles.column} style={{color: 'var(--tertiary-color)'}}>
                    <h5>fat</h5>
                    <p>{recipe && recipe.nutrients.totalNutrients.FAT.quantity}</p>
                </div>
                <div className={styles.column} style={{color: 'var(--secondary-color)'}}>
                    <h5>carb</h5>
                    <p>{recipe && recipe.nutrients.totalNutrients.CHOCDF.quantity}</p>
                </div>
         </div> 
    </>)
}

export default ClosedRecipeCard