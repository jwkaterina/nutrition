'use client'

import Slide from './slide'
import Button from '@/app/components/slider/button'
import { Food } from '@/app/types/types'
import FoodCard from '../../cards/food-cards/food-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import LoadingSpinner from '@/app/components/overlays/loading/loading-spinner';
import ErrorModal from '@/app/components/overlays/error-modal/error-modal';

const Food = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [food, setFood] = useState<Food[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchFood = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/foods/user/${user}`
                );
                setFood(responseData.foods);
            } catch (err) {}
        };
        fetchFood();
    }, []);

    // if(food.length > 0) {
    //     console.log(food);
    // }

    let foodList: any[] = [];
    useEffect(() => {
        if (food.length > 0) {
            console.log(food);
            foodList = food.map((food, index) => {
                return (
                    <FoodCard food={food} index={index + 1} key={food.food.foodId} />
                )
            })
        }
    }, [food])

    return (<>
        {error && <ErrorModal error={error} onClose={clearError} />}
        {isLoading && <LoadingSpinner />}
         <Slide>
            {foodList.length > 0 && foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>  
    </>)
}

export default Food