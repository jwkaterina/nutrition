'use client'

import { SlideType } from "@/app/types/types"
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from '@/app/context/food-context'
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

    const slide = useContext(SlideContext);
    const cardOpen = useContext(SetCardOpenContext);
    const setCardOpen = useContext(SetCardOpenContext);
    const { currentFood } = useContext(CurrentFoodContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const deleteCard = (index: number | null): void => {
        switch(slide) {
            case SlideType.FOOD:
                deleteFood(currentFood.id);
                break;
            case SlideType.RECIPE:
                // deleteRecipe(index);
                break;
            case SlideType.MENU:
                // deleteMenu(index);
                break;
        }
    }

    const deleteFood = async (id: string | null) => {
        try {
            await sendRequest(
                `http://localhost:5001/foods/${id}`,
                'DELETE'
            );
            onFoodDelete();
            setCardOpen(0);
        } catch (err) {}
    }

    // const deleteRecipe = (index: number | null): void => {
    //     recipeDispatch({type: 'delete', index: index! - 1});
    // }

    // const deleteMenu = (index: number | null): void => {
    //     menuDispatch({type: 'delete', index: index! - 1})
    // }

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner />}
        <Menu 
            leftText="Back" 
            rightText="Delete" 
            onLeftclick={() => setCardOpen(0)} 
            onRightclick={() => deleteCard(cardOpen)} 
        />
    </>)
}

export default OpenCardMenu