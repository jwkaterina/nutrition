import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedFood } from '@/app/types/types'
import FoodCard from '../../cards/food-cards/food-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import  LoadingSpinner from '@/app/components/utilities/loading/loading-spinner';import Toast from '@/app/components/utilities/toast/toast';

interface FoodSlideProps {
    foodDeleted: boolean
}

const FoodSlide = ({ foodDeleted }: FoodSlideProps): JSX.Element => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [foodList, setFoodList] = useState<JSX.Element[]>([]);

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
                const foodList = responseData.foods.map((food: LoadedFood, index: number) => {
                    return (
                        <FoodCard food={food.food} index={index + 1} key={index + 1} id={food.id} open={false}/>
                    )
                })
                setFoodList(foodList);
            } catch (err) {}
        };
        fetchFood();
    }, [foodDeleted]);

    return (<>
        <Toast active ={error ? true : false} status={'Error'} message={error ? error : ''} clearError={clearError} />
        {isLoading && <LoadingSpinner />}
         <Slide>
            {foodList.length > 0 && foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>  
    </>)
}

export default FoodSlide