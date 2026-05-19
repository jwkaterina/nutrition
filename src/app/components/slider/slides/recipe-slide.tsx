import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import RecipeCard from '../../cards/recipe-cards/recipe-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedRecipe } from '@/app/types/types';

const fetcher = ([url, token]: [string, string]) =>
    fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json());

const RecipeSlide = (): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { data } = useSWR(token ? ['/recipes', token] : null, fetcher);

    const recipeList = data?.recipe?.map((recipe: LoadedRecipe, index: number) => (
        <RecipeCard recipe={recipe.recipe} image={recipe.image && `${recipe.image}`} index={index + 1} key={index + 1} id={recipe.id} open={false}/>
    )) ?? [];

    return (
        <Slide>
            {recipeList.length > 0 && recipeList}
            <Button search={'analysis/recipe-analysis'}/>
        </Slide>
    );
}

export default RecipeSlide;
