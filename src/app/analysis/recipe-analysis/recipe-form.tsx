import { useContext } from 'react'
import styles from './page.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';

interface RecipeFormProps {
}

const RecipeForm = ({ }: RecipeFormProps): JSX.Element => {

    const { cardOpen } = useContext(CardOpenContext);

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div className={styles.container} style={style()}>
            <form className={styles.form}>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-name">Recipe Name</label>
                        <input type="text" id="recipe-name" name="recipe-name"/>
                    </div>
                    <div className={styles.form_group}>
                        <button type="button" className={styles.add_button}>Add Image</button>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-ingredients">Ingredients
                            <span>(Enter each ingredient on a new line)</span>
                        </label>
                        <textarea id="recipe-ingredients" name="recipe-ingredients"
                        placeholder={'1 cup rice,' + '\n' + '10 oz chickpeas,' + '\n' + '3 medium carrots' + '\n' + '1 tablespoon olive oil'}/>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="recipe-servings">Number of Servings</label>
                        <input type="number" id="recipe-servings" name="recipe-servings"/>
                    </div>
                    <div className={styles.form_group}>
                        <button type="submit">Analyze</button>
                    </div>
            </form>
        </div>
    )
}

export default RecipeForm