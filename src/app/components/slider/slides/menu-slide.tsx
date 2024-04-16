
import { useEffect, useState, useContext } from 'react';
import Button from '@/app/components/slider/button';
import MenuCard from '../../cards/menu-cards/menu-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { useMenuFetch } from '@/app/hooks/menu-hook';
import { LoadedMenu, LoadedRecipe, Nutrients, RecipeWithServings } from '@/app/types/types';

const MenuSlide = (): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [menuList, setMenuList] = useState<JSX.Element[]>([]);
    const { token } = useContext(AuthContext);
    const { fetchMenuNutrients} = useMenuFetch();

    useEffect(() => {
        if(!token) {
            setMenuList([]);
            return;
        }
        const fetchMenus = async () => {
            try {
                const responseData = await sendRequest(
                    `/menus`,'GET', null, {
                        Authorization: 'Bearer ' + token
                    }, true, false
                );
                const menus = await Promise.all(responseData.menus.map(async (menu: LoadedMenu) => {
                    const recipeWithServings = await fetchRecipes(menu);
                    const nutrients: Nutrients | null = await fetchMenuNutrients(menu.menu.ingredients, recipeWithServings);
                    return {
                        menu: {
                            name: menu.menu.name,
                            ingredients: menu.menu.ingredients,
                            nutrients: nutrients,
                            recipes: recipeWithServings
                        },
                        id: menu.id
                    }
                }));
                const menuList = menus.map((menu: LoadedMenu, index: number) => {
                    return (
                        <MenuCard menu={menu.menu} index={index + 1} key={index + 1} id={menu.id} open={false}/>
                    )
                })
                setMenuList(menuList);
            } catch (err) {}
        };
        fetchMenus();
    }, [token]);

    const fetchRecipes = async(menu: LoadedMenu) => {
            const recipes = await Promise.all(menu.menu.recipes.map(async(recipe: RecipeWithServings) => {
            const menuRecipe = await sendRequest(
                `/recipes/${recipe.selectedRecipe}`,'GET', null, {
                    Authorization: 'Bearer ' + token
                }, true, false
            );
            return {
                selectedRecipeId: menuRecipe.recipe.id,
                selectedRecipe: {
                    name: menuRecipe.recipe.recipe.name,
                    servings: menuRecipe.recipe.recipe.servings,
                    ingredients: menuRecipe.recipe.recipe.ingredients,
                    nutrients: menuRecipe.recipe.recipe.nutrients
                },
                selectedServings: recipe.selectedServings
            }
        }));
        return recipes
    }

    return (
         <Slide>
            {menuList.length > 0 && menuList}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>  
    );
}

export default MenuSlide;