import styles from '../card.module.css'
import { useEffect, useState } from 'react'
import { Nutrients, NutrientsProp, Recipe } from '@/app/types/types'
import RecipeHeaderCard from './header-recipecard'
import DailyValueCard from '../../analysis_cards/dailyvalue_card'
import CompositionCard from '../../analysis_cards/composition_card'
import BigNutrientsCard from '../../analysis_cards/bignutrients_card'
import VitaminsCard from '../../analysis_cards/vitamins_card'
import MineralsCard from '../../analysis_cards/minerals_card'
import FatsCard from '../../analysis_cards/fats_card'
import RecipeNutrientsCalculator from '../recipe-util'

interface OpenRecipeCardProps {
    recipe: Recipe
}

const OpenRecipeCard  = ({ recipe }: OpenRecipeCardProps): JSX.Element => {

    const [content, setContent] = useState<Nutrients | null>(null);

    const weight: number = recipe.nutrients.totalWeight;
    const devideBy: number = weight / 100;

    const proteinPer100gram: number = recipe.nutrients.totalNutrients.PROCNT.quantity / devideBy;
    const carbsPer100gram: number = recipe.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
    const fatPer100gram: number = recipe.nutrients.totalNutrients.FAT.quantity / devideBy;

    useEffect(() => {
        const recipeContent = RecipeNutrientsCalculator(recipe.nutrients, recipe.servings, 1);
        setContent(recipeContent);
    }, [])

    return (
        <div className={styles.card_grid}>
            <RecipeHeaderCard recipe={recipe} />
            {content && <DailyValueCard content={content} />}
            <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            />
            {content && <BigNutrientsCard content={content} />}
            {content && <VitaminsCard content={content} />}
            {content && <MineralsCard content={content} />}
            {content && <FatsCard content={content} />}
        </div>
    )
}

export default OpenRecipeCard