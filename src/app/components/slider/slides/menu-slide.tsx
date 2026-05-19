import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import MenuCard from '../../cards/menu-cards/menu-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedMenu, RecipeWithServings, Recipe } from '@/app/types/types';

const fetcher = ([url, token]: [string, string]) =>
    fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json());

const MenuSlide = (): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { data } = useSWR(token ? ['/menus', token] : null, fetcher);

    const menuList = data?.menus?.map((menu: any, index: number) => {
        const recipes: RecipeWithServings[] = menu.menu.recipes.map((r: any) => ({
            selectedRecipeId: r.selectedRecipe.id,
            selectedRecipe: r.selectedRecipe.recipe as Recipe,
            selectedServings: r.selectedServings
        }));
        const loaded: LoadedMenu = {
            creator: menu.creator,
            menu: {
                name: menu.menu.name,
                ingredients: menu.menu.ingredients,
                nutrients: menu.menu.nutrients,
                recipes
            },
            id: menu.id
        };
        return (
            <MenuCard menu={loaded.menu} index={index + 1} key={index + 1} id={loaded.id} open={false}/>
        );
    }) ?? [];

    return (
        <Slide>
            {menuList.length > 0 && menuList}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>
    );
}

export default MenuSlide;
