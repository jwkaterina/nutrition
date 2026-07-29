'use client';
import { useEffect, useContext, useState } from "react";
import { useRouter } from 'next/navigation';
import Menu from './menu';
import { AuthContext } from "@/app/context/auth-context";
import { StatusContext } from "@/app/context/status-context";
import { CardOpenContext } from "@/app/context/card-context";
import { CurrentFoodContext } from "@/app/context/food-context";
import { CurrentRecipeContext } from "@/app/context/recipe-context";
import { CurrentMenuContext } from "@/app/context/menu-context";
import { SlideContext } from "@/app/context/slide-context";
import { useHttpClient } from '@/app/hooks/http-hook';
import { CardState, Food, Nutrients, Recipe, MenuProp, AnalysisMode, StatusType } from "@/app/types/types";

interface OpenAnalysisMenuProps {
    file?: Blob | null;
    setFile?: (file: any) => void;
    imageUrl?: string | null;
    setImageUrl?: (url: string | null) => void;
}

const OpenAnalysisMenu = ({ file, setFile, imageUrl, setImageUrl }: OpenAnalysisMenuProps): JSX.Element => {

    const router = useRouter();
    const { currentFood, setCurrentFood } = useContext(CurrentFoodContext);
    const { currentRecipe, setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { currentMenu, setCurrentMenu } = useContext(CurrentMenuContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setIsLoading, setMessage, setStatus } = useContext(StatusContext);
    const { token } = useContext(AuthContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { sendRequest } = useHttpClient();
    const [rightText, setRightText] = useState<string>('Save');

    useEffect(() => {
        if(currentRecipe.mode == AnalysisMode.EDIT || currentMenu.mode == AnalysisMode.EDIT) setRightText('Save');
    }, [currentRecipe.mode, currentMenu.mode]);
 
    const addToFavorites = async () => {
        if(currentFood.food) addFoodToFavorites();
        if(currentRecipe.recipe) addRecipeToFavorites();
        if(currentMenu.menu) addMenuToFavorites();
    }

    const addFoodToFavorites = async () => {
        const food: Food | null = currentFood!.food;
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add food to favorites.');
            setIsLoading(false);
            return;
        }
        try {
            const gramUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
            console.log(`[Edamam] findNutrients (save): foodId=${food!.food.foodId}`);
            const nutrients100g: Nutrients = await sendRequest(
                '/api/nutrients',
                'POST',
                JSON.stringify({ foodId: food!.food.foodId, measure: gramUri, quantity: 100 }),
                { 'Content-Type': 'application/json' },
                false, false
            );
            const foodWithNutrients: Food = {
                ...food!,
                food: { ...food!.food, nutrients100g }
            };
            const formData = new FormData();
            formData.append('food', JSON.stringify(foodWithNutrients));
            await sendRequest('/foods', 'POST', formData, { Authorization: 'Bearer ' + token });
            setRightText('Go To Favorites');
            setMessage('Food added to favorites.');
        } catch (err) {}
    }

    const addRecipeToFavorites = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add recipe to favorites.');
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('recipe', JSON.stringify(Recipe));
            if (file) formData.append('image', file as Blob);
            else if (imageUrl) formData.append('imageUrl', imageUrl);
            await sendRequest('/recipes', 'POST', formData, { Authorization: 'Bearer ' + token });
            setRightText('Go To Favorites');
            setMessage('Recipe added to favorites.');
        } catch (err) {}
    }

    const addMenuToFavorites = async () => {
        const menuRecipes = currentMenu!.menu?.recipes.map(recipe => {
            return {
            selectedRecipe: recipe.selectedRecipeId,
            selectedServings: recipe.selectedServings
        }});
        const Menu = {
            name: currentMenu!.menu?.name,
            ingredients: currentMenu!.menu?.ingredients,
            nutrients: currentMenu!.menu?.nutrients,
            recipes: menuRecipes
        };
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to add meal plan to favorites.');
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('menu', JSON.stringify(Menu));
            if (file) formData.append('image', file as Blob);
            else if (imageUrl) formData.append('imageUrl', imageUrl);
            await sendRequest('/menus', 'POST', formData, { Authorization: 'Bearer ' + token });
            setRightText('Go To Favorites');
            setMessage('Meal plan added to favorites.');
        } catch (err) {}
    }

    const updateFavorites = async () => {
        if(currentRecipe.recipe) updateRecipe();
        if(currentMenu.menu) updateMenu();
    }

    const updateRecipe = async () => {
        const Recipe: Recipe | null = currentRecipe!.recipe;
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to update recipe.');
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('recipeString', JSON.stringify(Recipe));
            if (file) formData.append('image', file as Blob);
            else if (imageUrl) formData.append('imageUrl', imageUrl);
            await sendRequest(`/recipes/${currentRecipe.id}`, 'PATCH', formData, { Authorization: 'Bearer ' + token });
            setRightText('Go To Favorites');
            setMessage('Recipe updated in favorites.');
        } catch (err) {}
    }

    const updateMenu = async () => {
        const menuRecipes = currentMenu!.menu?.recipes.map(recipe => {
            return {
            selectedRecipe: recipe.selectedRecipeId,
            selectedServings: recipe.selectedServings
        }});
        const Menu = {
            name: currentMenu!.menu?.name,
            ingredients: currentMenu!.menu?.ingredients,
            nutrients: currentMenu!.menu?.nutrients,
            recipes: menuRecipes
        };
        if(!token) {
            setStatus(StatusType.ERROR);
            setMessage('You must be logged in to update meal plan.');
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('updatedMenu', JSON.stringify(Menu));
            if (file) formData.append('image', file as Blob);
            else if (imageUrl) formData.append('imageUrl', imageUrl);
            await sendRequest(`/menus/${currentMenu.id}`, 'PATCH', formData, { Authorization: 'Bearer ' + token });
            setRightText('Go To Favorites');
            setMessage('Meal plan updated in favorites.');
        } catch (err) {}
    }

    const handleRightClick = (): void => {
        if(rightText === 'Save') {
            if(currentRecipe.mode === AnalysisMode.EDIT || currentMenu.mode === AnalysisMode.EDIT) {
                updateFavorites();
            } else {
                addToFavorites();
            }
        } else if(rightText === 'Go To Favorites') {
            setCardOpen(CardState.CLOSED);
            setCurrentFood({id: null, food: null});
            setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
            setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
            setFile && setFile(null);
            setImageUrl && setImageUrl(null);
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
        }
    }

    const handleBackClick = (): void => {
        if(currentFood.food) {
            setCardOpen(CardState.CLOSING);
            setCurrentFood({id: null, food: null});
        } else { 
            setCardOpen(CardState.CLOSED);
        }
    }

    return (
        <Menu
            leftText='Back to Analysis'
            rightText={rightText}
            rightIsLink={rightText === 'Go To Favorites'}
            onLeftclick={handleBackClick}
            onRightclick={handleRightClick}
        />
    );
}

export default OpenAnalysisMenu;