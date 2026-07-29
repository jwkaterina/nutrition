'use client';
import { useContext, useEffect, useState } from "react";
import Menu from "./menu";
import { useRouter} from 'next/navigation';
import { AuthContext } from "@/app/context/auth-context";
import { CardOpenContext } from "@/app/context/card-context";
import { CurrentFoodContext } from '@/app/context/food-context';
import { CurrentRecipeContext } from '@/app/context/recipe-context';
import { CurrentMenuContext } from '@/app/context/menu-context';
import { StatusContext } from "@/app/context/status-context";
import { useHttpClient } from "@/app/hooks/http-hook";
import { CardState, AnalysisMode } from "@/app/types/types";

interface OpenCardMenuProps {
    onFoodDelete: () => void
}

const OpenCardMenu = ({ onFoodDelete }: OpenCardMenuProps): JSX.Element => {

    const router = useRouter();
    const { setCardOpen } = useContext(CardOpenContext);
    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setMessage, setAction } = useContext(StatusContext);
    const { token } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [rightText, setRightText] = useState<string>("Delete");

    const deleteFood = async () => {
        const snapshot = currentFood.food;
        try {
            const response = await sendRequest(
                `/foods/${currentFood.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );
            const savedImageName = response?.imageName ?? null;
            onFoodDelete();
            setCurrentFood({id: null, food: null});
            setCardOpen(CardState.CLOSED);
            if (snapshot) {
                setMessage("Food deleted");
                setAction({
                    label: 'Undo',
                    onClick: async () => {
                        try {
                            const formData = new FormData();
                            formData.append('food', JSON.stringify(snapshot));
                            if (snapshot.food?.image) formData.append('imageUrl', snapshot.food.image);
                            await sendRequest('/foods', 'POST', formData, { Authorization: 'Bearer ' + token });
                            onFoodDelete();
                            setMessage('Food restored');
                        } catch (err) {}
                    }
                });
            } else {
                setMessage("Food deleted successfully");
            }
        } catch (err) {}
    }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
        setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
    }

    const handleRightClick = (): void => {
        if(rightText === 'Edit') {
            if(currentRecipe.recipe) {
                setCurrentRecipe({id: currentRecipe.id, recipe: currentRecipe.recipe, image: currentRecipe.image, mode: AnalysisMode.EDIT});
                router.push('/analysis/recipe-analysis?edit=1');
            }
            if(currentMenu.menu) {
                setCurrentMenu({id: currentMenu.id, menu: currentMenu.menu, mode: AnalysisMode.EDIT});
                router.push('/analysis/menu-analysis?edit=1');
            }
        } else deleteFood();
    }

    useEffect(() => {
        if(currentFood.food) return;
        if(currentRecipe.recipe) setRightText("Edit");
        if(currentMenu.menu) setRightText("Edit");
    }, [currentFood, currentRecipe, currentMenu]);

    return (
        <Menu 
            leftText="Back to Favorites" 
            rightText={rightText}
            onLeftclick={handleBackClick} 
            onRightclick={handleRightClick} 
        />
    );
}

export default OpenCardMenu;