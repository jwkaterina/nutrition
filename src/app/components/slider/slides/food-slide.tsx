import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import FoodCard from '../../cards/food-cards/food-card';
import Slide from './slide';
import { SkeletonCard, EmptyState, SignInPrompt, useMinimumSkeletonTime } from '../slide-states';
import { AuthContext } from '@/app/context/auth-context';
import { LoadedFood } from '@/app/types/types';

interface FoodSlideProps {
    foodDeleted: boolean
}

const fetcher = ([url, token]: [string, string]) =>
    fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
    });

const FoodSlide = ({ foodDeleted }: FoodSlideProps): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { data, isLoading } = useSWR(token ? ['/foods', token, foodDeleted] : null, fetcher);
    const minSkeletonElapsed = useMinimumSkeletonTime(!!data);

    const foods: LoadedFood[] = data?.foods ?? [];
    const stillLoading = isLoading || !data || !minSkeletonElapsed;
    const showSkeletons = !!token && stillLoading;
    const showEmpty = !!token && !stillLoading && foods.length === 0;

    return (
        <Slide>
            {!token && <SignInPrompt kind="foods" />}
            {token && showSkeletons && Array.from({ length: 6 }, (_, i) => <SkeletonCard key={`s-${i}`} />)}
            {token && !showSkeletons && foods.map((food, index) => (
                <FoodCard food={food.food} index={index + 1} key={index + 1} id={food.id} open={false}/>
            ))}
            {token && showEmpty && (
                <EmptyState
                    message="No foods yet. Analyze an ingredient and save it to your library."
                    cta="Add your first food"
                    search="analysis/food-analysis"
                />
            )}
            {token && !showEmpty && <Button search={'analysis/food-analysis'}/>}
        </Slide>
    );
}

export default FoodSlide;
