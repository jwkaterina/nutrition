import { useContext } from 'react';
import useSWR from 'swr';
import Button from '@/app/components/slider/button';
import FoodCard from '../../cards/food-cards/food-card';
import Slide from './slide';
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
    const { data } = useSWR(token ? ['/foods', token, foodDeleted] : null, fetcher);

    const foodList = data?.foods?.map((food: LoadedFood, index: number) => (
        <FoodCard food={food.food} index={index + 1} key={index + 1} id={food.id} open={false}/>
    )) ?? [];

    return (
        <Slide>
            {foodList.length > 0 && foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>
    );
}

export default FoodSlide;
