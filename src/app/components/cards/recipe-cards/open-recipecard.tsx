import BigNutrientsCard from '../../analysis-cards/bignutrients-card';
import CompositionCard from '../../analysis-cards/composition-card';
import DailyValueCard from '../../analysis-cards/dailyvalue-card';
import FatsCard from '../../analysis-cards/fats-card';
import MineralsCard from '../../analysis-cards/minerals-card';
import RecipeHeaderCard from './header-recipecard';
import VitaminsCard from '../../analysis-cards/vitamins-card';
import { Recipe } from '@/app/types/types';
import styles from '../card.module.css';

interface OpenRecipeCardProps {
    recipe: Recipe,
    image: string | null
}

const OpenRecipeCard  = ({ recipe, image }: OpenRecipeCardProps): JSX.Element => {

    const weight: number = recipe.nutrients.totalWeight;
    const devideBy: number = weight / 100;

    const proteinPer100gram: number = recipe.nutrients.totalNutrients.PROCNT.quantity / devideBy;
    const carbsPer100gram: number = recipe.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
    const fatPer100gram: number = recipe.nutrients.totalNutrients.FAT.quantity / devideBy;

    return (
        <div className={styles.card_grid}>
            <RecipeHeaderCard recipe={recipe} image={image && image}/>
            {recipe.nutrients && <DailyValueCard content={recipe.nutrients} />}
            <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            />
            {recipe.nutrients && <BigNutrientsCard content={recipe.nutrients} />}
            {recipe.nutrients && <VitaminsCard content={recipe.nutrients} />}
            {recipe.nutrients && <MineralsCard content={recipe.nutrients} />}
            {recipe.nutrients && <FatsCard content={recipe.nutrients} />}
        </div>
    );
}

export default OpenRecipeCard;