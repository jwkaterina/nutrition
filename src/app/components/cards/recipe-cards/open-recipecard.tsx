import BigNutrientsCard from '../../analysis_cards/bignutrients_card';
import CompositionCard from '../../analysis_cards/composition_card';
import DailyValueCard from '../../analysis_cards/dailyvalue_card';
import FatsCard from '../../analysis_cards/fats_card';
import MineralsCard from '../../analysis_cards/minerals_card';
import RecipeHeaderCard from './header-recipecard';
import VitaminsCard from '../../analysis_cards/vitamins_card';
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