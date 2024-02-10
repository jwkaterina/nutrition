import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedFood, StatusType } from '@/app/types/types'
import FoodCard from '../../cards/food-cards/food-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import { StatusContext } from '@/app/context/status-context'

interface FoodSlideProps {
    foodDeleted: boolean
}

const FoodSlide = ({ foodDeleted }: FoodSlideProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [foodList, setFoodList] = useState<JSX.Element[]>([]);
    const { setIsLoading, setMessage, setStatus } = useContext(StatusContext);

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
            } catch (err) {
                setStatus(StatusType.ERROR);
                setMessage("Could not fetch food. Try again later.");
                setIsLoading(false);
                throw err;
            }
        };
        fetchFood();
    }, [foodDeleted]);

    return (<>
         <Slide>
            {foodList.length > 0 && foodList}
            <Button search={'analysis/food-analysis'}/>
        </Slide>  
    </>)
}

export default FoodSlide