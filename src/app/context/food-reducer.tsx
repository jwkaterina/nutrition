import { Food } from "@/app/types/types";

type ACTIONTYPE = { 
    type: 'delete' | 'add',
    id: string,
    item: Food
}

export const  FoodReducer = (food: Food[], action: ACTIONTYPE) => {
    switch (action.type) {
        case 'delete': {
            const newFood = food.filter((food) => food.food.foodId != action.id);
            saveFood(newFood);
            return newFood;
        }
        case 'add': {
            if(food.find((food) => food.food.foodId == action.item.food.foodId)) {
                return food;
            }
            const newFood = [...food, action.item];
            saveFood(newFood);
            return newFood;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const saveFood = (food: Food[]) => {
    localStorage.setItem('food', JSON.stringify(food));
}