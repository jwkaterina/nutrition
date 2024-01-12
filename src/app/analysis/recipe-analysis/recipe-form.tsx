import { useContext } from 'react'
import styles from './page.module.css'
import { CardOpenContext } from '@/app/context/card-context';
import { CardState } from '@/app/types/types';

const RecipeForm = () => {

    const cardOpen = useContext(CardOpenContext);

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div className={styles.container} style={style()}>
            <h1>Recipe Form</h1>
        </div>
    )
}

export default RecipeForm