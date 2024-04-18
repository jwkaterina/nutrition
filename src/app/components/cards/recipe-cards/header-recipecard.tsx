import { Recipe } from '@/app/types/types';
import styles from '../../analysis-cards/alanysis-card.module.css';

interface RecipeHeaderCardProps {
    recipe: Recipe,
    image: string | null
}

const RecipeHeaderCard = ({ recipe, image }: RecipeHeaderCardProps): JSX.Element => {

    const style = () => {
        if(image) {
            return { gridTemplateColumns: '1fr 3fr' }
        } else {
            return { gridTemplateColumns: '1fr' }
        }
    }

    return(
        <div className={styles.container} style={{gridArea: 'header'}}>
            <div className={styles.header} style={style()}>
                {image && <img src={image} alt="" className={styles.img}/>}
                <h1>{recipe.name}</h1>      
            </div>
            <div className={styles.form}>
                <div className={styles.long_input} id="measure">{`1 serving - ${(recipe.nutrients.totalWeight).toFixed(0)}g`}</div>
            </div>
        </div>
    );
}

export default RecipeHeaderCard;