import { useContext, useState } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import { CurrentRecipeContext } from "@/app/context/recipe-context"
// import { CurrentMenuContext } from "@/app/context/menu-context"
import { SlideContext } from "@/app/context/slide-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context"
import ErrorModal from "@/app/components/overlays/error-modal/error-modal"
import LoadingSpinner from "@/app/components/overlays/loading/loading-spinner"
import { CardState, Food, Recipe } from "@/app/types/types"

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState<string>('Add To Favorites');
    const router = useRouter();

    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    // const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { user } = useContext(AuthContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { slide } = useContext(SlideContext);
 
    const addToFavorites = async () => {
        if(currentFood.food) addFoodToFavorites();
        if(currentRecipe.recipe) addRecipeToFavorites();
        // if(currentMenu.menu) addMenuToFavorites();
    }

    const addFoodToFavorites = async () => {
        const Food: Food | null = currentFood!.food;
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
            setRightText('Go To Favorites');
            } catch (err) {}
    }

    const addRecipeToFavorites = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        try {
            await sendRequest(
                'http://localhost:5001/recipes',
                'POST',
                JSON.stringify({
                recipe: Recipe,
                creator: user
                }),
                { 'Content-Type': 'application/json' }
            );
            setRightText('Go To Favorites');
            } catch (err) {}
    }

    // const addMenuToFavorites = async () => {
    // }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(CardState.CLOSED);
            setCurrentFood({id: null, food: null});
            setCurrentRecipe({id: null, recipe: null});
            // setCurrentMenu({id: null, menu: null});
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
        }
    }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
    }

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner/>}
        <Menu 
            leftText='Back to Analysis' 
            rightText={rightText} 
            onLeftclick={handleBackClick} 
            onRightclick={handleRightClick}
        />
    </>)
}

export default OpenAnalysisMenu