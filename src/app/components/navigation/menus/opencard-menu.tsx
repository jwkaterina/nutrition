import { CardState, AnalysisMode } from "@/app/types/types"
import { useContext, useEffect, useState } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from '@/app/context/food-context'
import { CurrentRecipeContext } from '@/app/context/recipe-context'
import { CurrentMenuContext } from '@/app/context/menu-context'
import { StatusContext } from "@/app/context/status-context"
import { useHttpClient } from "@/app/hooks/http-hook"
import Menu from "./menu"
import { useRouter} from 'next/navigation';

interface OpenCardMenuProps {
    onFoodDelete: () => void
}

const OpenCardMenu = ({ onFoodDelete }: OpenCardMenuProps): JSX.Element => {


    const { setCardOpen } = useContext(CardOpenContext);
    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { sendRequest } = useHttpClient();
    const [rightText, setRightText] = useState<string>("Delete");
    const { setMessage } = useContext(StatusContext);

    const router = useRouter();

    const deleteFood = async () => {
        try {
            await sendRequest(
                `http://localhost:5001/foods/${currentFood.id}`,
                'DELETE'
            );
            onFoodDelete();
            setCurrentFood({id: null, food: null});
            setMessage("Food deleted successfully");
            setTimeout(() => {
                setCardOpen(CardState.CLOSED);
            }, 4000);
        } catch (err) {
            setMessage("Could not delete food. Try again later.");
        }
    }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
        setCurrentRecipe({id: null, recipe: null, mode: AnalysisMode.VIEW});
        setCurrentMenu({id: null, recipe: null, mode: AnalysisMode.VIEW});
    }

    const handleRightClick = (): void => {
        if(rightText === 'Edit') {
            if(currentRecipe.recipe) {
                router.push('/analysis/recipe-analysis');
                setCurrentRecipe({id: currentRecipe.id, recipe: currentRecipe.recipe, mode: AnalysisMode.EDIT});
            }
            if(currentMenu.menu) {
                router.push('/analysis/menu-analysis');
                setCurrentMenu({id: currentMenu.id, menu: currentMenu.menu, mode: AnalysisMode.EDIT});
            }
            setCardOpen(CardState.CLOSING);
        } else deleteFood();
    }

    useEffect(() => {
        if(currentFood.food) return;
        if(currentRecipe.recipe) setRightText("Edit");
        if(currentMenu.menu) setRightText("Edit");
    }, [currentFood, currentRecipe, currentMenu])

    return (<>
        <Menu 
            leftText="Back to Favorites" 
            rightText={rightText}
            onLeftclick={handleBackClick} 
            onRightclick={handleRightClick} 
        />
    </>)
}

export default OpenCardMenu