'use client'

import { useContext, useState } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context"
import ErrorModal from "@/app/components/overlays/error-modal/error-modal"
import LoadingSpinner from "@/app/components/overlays/loading/loading-spinner"

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState('Add To Favorites');
    const router = useRouter();

    const { currentFood } = useContext(CurrentFoodContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { user } = useContext(AuthContext);
 
    const addToFavorites = async () => {
        const food = currentFood!.food;
        const measures = food!.measures.map(measure => {
            return {
                uri: measure.uri,
                label: measure.label,
                weight: measure.weight
                };
        });
        const Food = {
            food: {
                category: food!.food.category,
                categoryLabel: food!.food.categoryLabel,
                foodId: food!.food.foodId,
                // image: food!.food.image,
                knownAs: food!.food.knownAs,
                label: food!.food.label,
                nutrients: {
                    ENERC_KCAL: food!.food.nutrients.ENERC_KCAL,
                    PROCNT: food!.food.nutrients.PROCNT,
                    FAT: food!.food.nutrients.FAT,
                    CHOCDF: food!.food.nutrients.CHOCDF,
                    FIBTG: food!.food.nutrients.FIBTG
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

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner/>}
        <Menu 
            leftText='Back' 
            rightText={rightText} 
            onLeftclick={() => setCardOpen(0)} 
            onRightclick={handleRightClick}
        />
    </>)
}

export default OpenAnalysisMenu