import { useEffect, useContext, useState } from "react"
import { CardOpenContext } from "@/app/context/card-context"
import { CurrentFoodContext } from "@/app/context/food-context"
import { CurrentRecipeContext } from "@/app/context/recipe-context"
import { CurrentMenuContext } from "@/app/context/menu-context"
import { SlideContext } from "@/app/context/slide-context"
import Menu from './menu'
import { useRouter } from 'next/navigation'
import { useHttpClient } from '@/app/hooks/http-hook';
import { AuthContext } from "@/app/context/auth-context";
import { StatusContext } from "@/app/context/status-context";
import { CardState, Food, Recipe, MenuProp, AnalysisMode, StatusType } from "@/app/types/types"

interface OpenAnalysisMenuProps {
    file?: any;
    setFile?: (file: any) => void;
}

const OpenAnalysisMenu = ({ file, setFile }: OpenAnalysisMenuProps): JSX.Element => {

    const [rightText, setRightText] = useState<string>('Add To Favorites');
    const router = useRouter();

    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { sendRequest } = useHttpClient();
    const { setIsLoading, setMessage, setStatus } = useContext(StatusContext);
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
        if(!user) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add food to favorites.');
            setIsLoading(false);
            return;
        }
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
            setMessage('Food added to favorites.');
            } catch (err) {
                setMessage('Could not add food to favorites. Try again later.');
            }
    }

    const addRecipeToFavorites = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        if(!user) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add food to favorites.');
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            const recipeString = JSON.stringify(Recipe);
            formData.append('recipe', recipeString);
            formData.append('creator', user);
            formData.append('image', file);
            await sendRequest(
                'http://localhost:5001/recipes',
                'POST',
                formData
            );
            setRightText('Go To Favorites');
            setMessage('Recipe added to favorites.');
            } catch (err) {
                setMessage('Could not add recipe to favorites. Try again later.');
            }
    }

    const addMenuToFavorites = async () => {
        const Menu: MenuProp | null = currentMenu!.menu;
        if(!user) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add food to favorites.');
            setIsLoading(false);
            return;
        }
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
            setMessage('Menu added to favorites.');
            } catch (err) {
                setMessage('Could not add menu to favorites. Try again later.');
                throw err;
            }
    }

    const updateFavorites = async () => {
        if(currentRecipe.recipe) updateRecipe();
        if(currentMenu.menu) updateMenu();
    }

    const updateRecipe = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        try {
            const formData = new FormData();
            const recipeString = JSON.stringify(Recipe);
            formData.append('recipeString', recipeString);
            formData.append('image', file);
            await sendRequest(
                `http://localhost:5001/recipes/${currentRecipe.id}`,
                'PATCH',
                formData
            );
            setRightText('Go To Favorites');
            setMessage('Recipe updated in favorites.');
            } catch (err) {
                setMessage('Could not update recipe in favorites. Try again later.');
            }
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
            setMessage('Menu updated in favorites.');
            } catch (err) {
                setMessage('Could not update menu in favorites. Try again later.');
            }
    }

    const handleRightClick = (): void => {
        if(rightText === 'Add To Favorites') {
            addToFavorites();
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(CardState.CLOSED);
            setCurrentFood({id: null, food: null});
            setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
            setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
            setFile && setFile(null);
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
        if(currentFood.food) {
            setCardOpen(CardState.CLOSING);
            setCurrentFood({id: null, food: null});
        }
        setCardOpen(CardState.CLOSED);
    }

    return (<>
        <Menu 
            leftText='Back to Analysis' 
            rightText={rightText} 
            onLeftclick={handleBackClick} 
            onRightclick={handleRightClick}
        />
    </>)
}

export default OpenAnalysisMenu