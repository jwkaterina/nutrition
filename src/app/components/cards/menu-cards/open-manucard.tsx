import styles from '../card.module.css'
import { MenuProp, Nutrients, NutrientsProp } from '@/app/types/types'
import MenuHeaderCard from './header-menucard'
import DailyValueCard from '../../analysis_cards/dailyvalue_card'
import CompositionCard from '../../analysis_cards/composition_card'
import BigNutrientsCard from '../../analysis_cards/bignutrients_card'
import VitaminsCard from '../../analysis_cards/vitamins_card'
import MineralsCard from '../../analysis_cards/minerals_card'
import FatsCard from '../../analysis_cards/fats_card'
import { useEffect, useState } from 'react'
import RecipeNutrientsCalculator from '../recipe-util'

interface OpenMenuCardProps {
    menu: MenuProp
}

const OpenMenuCard  = ({ menu }: OpenMenuCardProps): JSX.Element => {

    const [content, setContent] = useState<Nutrients | null>(null);

    // const weight: number = menu.nutrients.totalWeight;
    // const devideBy: number = weight / 100;

    // const proteinPer100gram: number = menu.nutrients.totalNutrients.PROCNT.quantity / devideBy;
    // const carbsPer100gram: number = menu.nutrients.totalNutrients.CHOCDF.quantity / devideBy;
    // const fatPer100gram: number = menu.nutrients.totalNutrients.FAT.quantity / devideBy;

    useEffect(() => {
        const ingredientsContent: Nutrients = menu.nutrients;
        
        let recipesContent: Nutrients = {
            calories: 0,
            totalNutrients: {},
            totalDaily: {},
            totalWeight: 0
        };

        menu.recipes.forEach(recipe => {
            const recipeContent = RecipeNutrientsCalculator(recipe.selectedRecipe.nutrients, recipe.selectedRecipe.servings, recipe.selectedServings);

            recipesContent = {
                calories: recipeContent.calories + recipeContent.calories,
                totalNutrients: Object.fromEntries(
                    Object.entries(recipeContent.totalNutrients).map(([key, value]) => [key, {
                        label: value.label,
                        quantity: value.quantity + recipeContent.totalNutrients[key].quantity,
                        unit: value.unit
                    }])
                ),
                totalDaily: Object.fromEntries(
                    Object.entries(recipeContent.totalDaily).map(([key, value]) => [key, {
                        label: value.label,
                        quantity: value.quantity + recipeContent.totalDaily[key].quantity,
                        unit: value.unit
                    }])
                ),
                totalWeight: recipeContent.totalWeight + recipeContent.totalWeight
            }
        });

        const totalContent: Nutrients = {
            calories: ingredientsContent.calories + recipesContent.calories,
            totalNutrients: Object.fromEntries(
                Object.entries(ingredientsContent.totalNutrients).map(([key, value]) => [key, {
                    label: value.label,
                    quantity: value.quantity + recipesContent.totalNutrients[key].quantity,
                    unit: value.unit
                }])
            ),
            totalDaily: Object.fromEntries(
                Object.entries(ingredientsContent.totalDaily).map(([key, value]) => [key, {
                    label: value.label,
                    quantity: value.quantity + recipesContent.totalDaily[key].quantity,
                    unit: value.unit
                }])
            ),
            totalWeight: ingredientsContent.totalWeight + recipesContent.totalWeight
        }
        setContent(totalContent);
    }, [])

    return (
        <div className={styles.card_grid}>
            <MenuHeaderCard menu={menu} />
            {content && <DailyValueCard content={content} />}
            {/* <CompositionCard 
                protein={proteinPer100gram}
                carbs={carbsPer100gram}
                fat={fatPer100gram}
            /> */}
            {content && <BigNutrientsCard content={content} />}
            {content && <VitaminsCard content={content} />}
            {content && <MineralsCard content={content} />}
            {content && <FatsCard content={content} />}
        </div>
    )
}

export default OpenMenuCard