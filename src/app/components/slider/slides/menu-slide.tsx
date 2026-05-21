import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import MenuCard from '../../cards/menu-cards/menu-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedMenu, RecipeWithServings, Recipe } from '@/app/types/types';

const fetcher = ([url, token]: [string, string]) =>
    fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
    });

const MenuSlide = (): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { data } = useSWR(token ? ['/menus', token] : null, fetcher);

    const menuList = data?.menus?.map((menu: any, index: number) => {
        const recipes: RecipeWithServings[] = (menu.menu.recipes ?? [])
            .filter((r: any) => {
                if (!r.selectedRecipe || typeof r.selectedRecipe === 'string') return false;
                return !!(r.selectedRecipe.recipe || r.selectedRecipe.name);
            })
            .map((r: any) => {
                const isDoc = !!r.selectedRecipe.recipe;
                return {
                    selectedRecipeId: isDoc ? r.selectedRecipe.id : (r.selectedRecipeId ?? ''),
                    selectedRecipe: (isDoc ? r.selectedRecipe.recipe : r.selectedRecipe) as Recipe,
                    selectedServings: r.selectedServings,
                    image: (isDoc ? r.selectedRecipe.image : r.image) ?? null
                };
            });
        const loaded: LoadedMenu = {
            creator: menu.creator,
            menu: {
                name: menu.menu.name,
                ingredients: menu.menu.ingredients,
                nutrients: menu.menu.nutrients,
                recipes
            },
            id: menu.id,
            image: menu.image ?? null
        };
        return (
            <MenuCard menu={loaded.menu} index={index + 1} key={index + 1} id={loaded.id} image={loaded.image} open={false}/>
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
