import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import RecipeCard from '../../cards/recipe-cards/recipe-card';
import Slide from './slide';
import { SkeletonCard, EmptyState, useMinimumSkeletonTime } from '../slide-states';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedRecipe } from '@/app/types/types';

const fetcher = ([url, token]: [string, string]) =>
    fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
    });

const RecipeSlide = (): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { data, isLoading } = useSWR(token ? ['/recipes', token] : null, fetcher);
    const minSkeletonElapsed = useMinimumSkeletonTime(!!data);

    const recipes: LoadedRecipe[] = data?.recipe ?? [];
    const stillLoading = isLoading || !data || !minSkeletonElapsed;
    const showSkeletons = !!token && stillLoading;
    const showEmpty = !!token && !stillLoading && recipes.length === 0;

    return (
        <Slide>
            {showSkeletons && Array.from({ length: 6 }, (_, i) => <SkeletonCard key={`s-${i}`} />)}
            {!showSkeletons && recipes.map((recipe, index) => (
                <RecipeCard recipe={recipe.recipe} image={recipe.image && `${recipe.image}`} index={index + 1} key={index + 1} id={recipe.id} open={false}/>
            ))}
            {showEmpty && (
                <EmptyState
                    message="No recipes yet. Combine ingredients into a recipe you can reuse."
                    cta="Create your first recipe"
                    search="analysis/recipe-analysis"
                />
            )}
            {!showEmpty && <Button search={'analysis/recipe-analysis'}/>}
        </Slide>
    );
}

export default RecipeSlide;
