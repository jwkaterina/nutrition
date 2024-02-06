import styles from '../../analysis_cards/alanysis_card.module.css';
import { Recipe } from '@/app/types/types';

interface RecipeHeaderCardProps {
    recipe: Recipe }

const RecipeHeaderCard = ({ recipe }: RecipeHeaderCardProps): JSX.Element => {

    const style = () => {
        if(recipe.image) {
            return {
                display: 'grid',
                gridTemplateColumns: '1fr 3fr'
            }
        } else {
            return {
                display: 'grid',
                gridTemplateColumns: '1fr'
            }
        }
    }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={style()}>
                {recipe.image && <img src={recipe.image} alt="" className={styles.img}/>}
                <h1>{recipe.name}</h1>      
            </div>
            <div className={styles.form}>
                <input className={styles.long_input} name="measure" id="measure" value={`1 serving - ${(recipe.nutrients.totalWeight).toFixed(0)}g`}></input>
            </div>
        </div>
    )
}

export default RecipeHeaderCard;