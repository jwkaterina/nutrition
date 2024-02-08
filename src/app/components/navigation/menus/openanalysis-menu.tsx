import { useEffect, useContext, useState } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import { CurrentRecipeContext } from "@/app/context/recipe-context"
import { CurrentMenuContext } from "@/app/context/menu-context"
import { SlideContext } from "@/app/context/slide-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context"
import LoadingSpinner from "@/app/components/utilities/loading/loading-spinner"
import { CardState, Food, Recipe, MenuProp, AnalysisMode } from "@/app/types/types"
import Toast from "../../utilities/toast/toast"

interface OpenAnalysisMenuProps {
    
}

const OpenAnalysisMenu = ({  }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState<string>('Add To Favorites');
    const router = useRouter();

    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { user } = useContext(AuthContext);
    const { setScrollBehavior } = useContext(SlideContext);

    useEffect(() => {
        if(currentRecipe.mode == AnalysisMode.EDIT || currentMenu.mode == AnalysisMode.EDIT) setRightText('Update Favorites');
    }, [currentRecipe.mode, currentMenu.mode]);
 
    const addToFavorites = async () => {
        if(currentFood.food) addFoodToFavorites();
        if(currentRecipe.recipe) addRecipeToFavorites();
        if(currentMenu.menu) addMenuToFavorites();
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

    const addMenuToFavorites = async () => {
        const Menu: MenuProp | null = currentMenu!.menu;
        try {
            await sendRequest(
                'http://localhost:5001/menus',
                'POST',
                JSON.stringify({
                menu: Menu,
                creator: user
                }),
                { 'Content-Type': 'application/json' }
            );
            setRightText('Go To Favorites');
            } catch (err) {}
    }

    const updateFavorites = async () => {
        if(currentRecipe.recipe) updateRecipe();
        if(currentMenu.menu) updateMenu();
    }

    const updateRecipe = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        try {
            await sendRequest(
                `http://localhost:5001/recipes/${currentRecipe.id}`,
                'PATCH',
                JSON.stringify({
                updatedRecipe: Recipe
                }),
                { 'Content-Type': 'application/json' }
            );
            setRightText('Go To Favorites');
            } catch (err) {}
    }

    const updateMenu = async () => {
        const Menu: MenuProp | null = currentMenu!.menu;
        try {
            await sendRequest(
                `http://localhost:5001/menus/${currentMenu.id}`,
                'PATCH',
                JSON.stringify({
                updatedMenu: Menu
                }),
                { 'Content-Type': 'application/json' }
            );
            setRightText('Go To Favorites');
            } catch (err) {}
    }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(CardState.CLOSED);
            setCurrentFood({id: null, food: null});
            setCurrentRecipe({id: null, recipe: null, mode: AnalysisMode.VIEW});
            setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
        } else if (rightText === 'Update Favorites') {
            updateFavorites();
        }
    }

    const handleBackClick = (): void => {
        setCardOpen(CardState.CLOSING);
        setCurrentFood({id: null, food: null});
    }

    return (<>
        <Toast active ={error ? true : false} status={'Error'} message={error ? error : ''} clearError={clearError} />
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