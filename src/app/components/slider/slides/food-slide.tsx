import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedFood } from '@/app/types/types'
import FoodCard from '../../cards/food-cards/food-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';

interface FoodSlideProps {
    foodDeleted: boolean
}

const FoodSlide = ({ foodDeleted }: FoodSlideProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [foodList, setFoodList] = useState<JSX.Element[]>([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if(!token) {
            setFoodList([]);
            return;
        }

        const fetchFood = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/foods`, 'GET', null, {
                        Authorization: 'Bearer ' + token
                      }
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
    }, [foodDeleted, token]);

    return (<>
         <Slide>
            {foodList.length > 0 && foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>  
    </>)
}

export default FoodSlide