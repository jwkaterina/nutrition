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
    const { setMessage } = useContext(StatusContext);
    const { token } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [rightText, setRightText] = useState<string>("Delete");

    const deleteFood = async () => {
        try {
            await sendRequest(
                `/foods/${currentFood.id}`,
                'DELETE', null, {
                    Authorization: 'Bearer ' + token
                }
            );
            onFoodDelete();
            setCurrentFood({id: null, food: null});
            setMessage("Food deleted successfully");
            setCardOpen(CardState.CLOSED);
        } catch (err) {}
    }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
        setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
        setCurrentMenu({id: null, recipe: null, mode: AnalysisMode.VIEW});
    }

    const handleRightClick = (): void => {
        if(rightText === 'Edit') {
            if(currentRecipe.recipe) {
                try { sessionStorage.setItem('editRecipe', JSON.stringify({ id: currentRecipe.id, recipe: currentRecipe.recipe, image: currentRecipe.image, mode: AnalysisMode.EDIT })); } catch {}
                setCurrentRecipe({id: currentRecipe.id, recipe: currentRecipe.recipe, image: currentRecipe.image, mode: AnalysisMode.EDIT});
                router.push('/analysis/recipe-analysis?edit=1');
            }
            if(currentMenu.menu) {
                try { sessionStorage.setItem('editMenu', JSON.stringify({ id: currentMenu.id, menu: currentMenu.menu, mode: AnalysisMode.EDIT })); } catch {}
                setCurrentMenu({id: currentMenu.id, menu: currentMenu.menu, mode: AnalysisMode.EDIT});
                router.push('/analysis/menu-analysis?edit=1');
            }
            setCardOpen(CardState.CLOSED);
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