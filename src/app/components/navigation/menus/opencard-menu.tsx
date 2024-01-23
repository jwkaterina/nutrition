import { SlideType, CardState } from "@/app/types/types"
import { useContext } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from '@/app/context/food-context'
import { CurrentRecipeContext } from '@/app/context/recipe-context'
// import { CurrentMenuContext } from '@/app/context/menu-context'
import { SlideContext } from '@/app/context/slide-context';
import { useHttpClient } from "@/app/hooks/http-hook"
import Menu from "./menu"
import ErrorModal from "@/app/components/overlays/error-modal/error-modal"
import LoadingSpinner from "@/app/components/overlays/loading/loading-spinner"

interface OpenCardMenuProps {
    onFoodDelete: () => void,
    onRecipeDelete: () => void,
    onMenuDelete: () => void,
}

const OpenCardMenu = ({ onFoodDelete, onMenuDelete, onRecipeDelete}: OpenCardMenuProps): JSX.Element => {

    const { slide } = useContext(SlideContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    // const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const deleteCard = (): void => {
        switch(slide) {
            case SlideType.FOOD:
                deleteFood();
                break;
            case SlideType.RECIPE:
                deleteRecipe();
                break;
            case SlideType.MENU:
                // deleteMenu(index);
                break;
        }
    }

    const deleteFood = async () => {
        try {
            await sendRequest(
                `http://localhost:5001/foods/${currentFood.id}`,
                'DELETE'
            );
            onFoodDelete();
            setCardOpen(CardState.CLOSING);
            setCurrentFood({id: null, food: null});
        } catch (err) {}
    }

    const deleteRecipe = async () => {
        try {
            await sendRequest(
                `http://localhost:5001/recipes/${currentRecipe.id}`,
                'DELETE'
            );
            onRecipeDelete();
            setCardOpen(CardState.CLOSING);
            setCurrentRecipe({id: null, recipe: null});
        } catch (err) {}
    }

    // const deleteMenu = (index: number | null): void => {
    //     menuDispatch({type: 'delete', index: index! - 1})
    // }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
        setCurrentRecipe({id: null, recipe: null});
        // setCurrentMenu({id: null, recipe: null});
    }

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner />}
        <Menu 
            leftText="Back to Favorites" 
            rightText="Delete" 
            onLeftclick={handleBackClick} 
            onRightclick={() => deleteCard()} 
        />
    </>)
}

export default OpenCardMenu