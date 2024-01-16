import { useContext, useState } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import { SlideContext } from "@/app/context/slide-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context"
import ErrorModal from "@/app/components/overlays/error-modal/error-modal"
import LoadingSpinner from "@/app/components/overlays/loading/loading-spinner"
import { CardState, Food, MeasureProp } from "@/app/types/types"

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState<string>('Add To Favorites');
    const router = useRouter();

    const { currentFood } = useContext(CurrentFoodContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { user } = useContext(AuthContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { slide } = useContext(SlideContext);
 
    const addToFavorites = async () => {
        const food: Food | null = currentFood!.food;
        const measures: MeasureProp[] = food!.measures.map(measure => {
            return {
                uri: measure.uri,
                label: measure.label,
                weight: measure.weight
                };
        });

        const Food: Food = {
            food: {
                category: food!.food.category,
                categoryLabel: food!.food.categoryLabel,
                foodId: food!.food.foodId,
                image: food!.food.image,
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
            setCardOpen(CardState.CLOSED);
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
        }
    }

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner/>}
        <Menu 
            leftText='Back to Analysis' 
            rightText={rightText} 
            onLeftclick={() => setCardOpen(CardState.CLOSING)} 
            onRightclick={handleRightClick}
        />
    </>)
}

export default OpenAnalysisMenu