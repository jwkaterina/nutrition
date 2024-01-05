'use client'

import { useContext, useState } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context"

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState('Add To Favorites');
    const router = useRouter();

    const currentFood = useContext(CurrentFoodContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { user } = useContext(AuthContext);
 
    const addToFavorites = async (): void => {
        const measures = currentFood!.measures.map(measure => {
            return {
                uri: measure.uri,
                label: measure.label,
                weight: measure.weight
                };
        });
        const Food = {
            food: {
                category: currentFood!.food.category,
                categoryLabel: currentFood!.food.categoryLabel,
                foodId: currentFood!.food.foodId,
                // image: currentFood!.food.image,
                knownAs: currentFood!.food.knownAs,
                label: currentFood!.food.label,
                nutrients: {
                    ENERC_KCAL: currentFood!.food.nutrients.ENERC_KCAL,
                    PROCNT: currentFood!.food.nutrients.PROCNT,
                    FAT: currentFood!.food.nutrients.FAT,
                    CHOCDF: currentFood!.food.nutrients.CHOCDF,
                    FIBTG: currentFood!.food.nutrients.FIBTG
                },
            },
            measures: measures
        };
        try {
            await sendRequest(
              'http://localhost:5001/foods',
              'POST',
              JSON.stringify({
               food: Food,
               creator: user
              }),
              { 'Content-Type': 'application/json' }
            );
          } catch (err) {
            console.log(err);
          }
        setRightText('Go To Favorites');
    }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(null);
            router.push('/');
        }
    }

    return <Menu 
        leftText='Back' 
        rightText={rightText} 
        onLeftclick={() => setCardOpen(0)} 
        onRightclick={handleRightClick}
    />
}

export default OpenAnalysisMenu