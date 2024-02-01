import styles from '../../analysis_cards/alanysis_card.module.css';
import { Recipe } from '@/app/types/types';

interface RecipeHeaderCardProps {
    recipe: Recipe }

const RecipeHeaderCard = ({ recipe }: RecipeHeaderCardProps): JSX.Element => {

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div style={{padding: '2rem'}}>
                <div className={styles.header}>
                    {recipe.image && <img src={recipe.image} alt="" className={styles.img}/>}
                    <h1>{recipe.name}</h1>      
                </div>
                <div className={styles.form}>
                    <select name="measure" id="measure">
                        <option>1 serving - {(recipe.nutrients.totalWeight).toFixed(0)}g</option>
                    </select>
                </div>
            </div>
    </div>
    )
}

export default RecipeHeaderCard;